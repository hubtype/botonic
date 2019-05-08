import { ContentfulClientApi, Entry } from 'contentful';
import { ContentNotFoundException } from '../cms';
import { getContentModel, DeliveryApi } from './deliveryApi';
import * as memoize from 'memoizee';
import * as cms from '../cms';
import * as sizeof from 'object-sizeof';
import * as core from '@botonic/core';

/**
 * We only cache by name the models which can be opened from payloads
 */
class ModelByTypeAndName {
  static CACHED_TYPES = [cms.ModelType.CAROUSEL, cms.ModelType.TEXT];
  private readonly map = new Map<string, Entry<any>>();

  set(entry: Entry<any>): void {
    let modelType = getContentModel(entry);
    if (ModelByTypeAndName.CACHED_TYPES.includes(modelType)) {
      this.map.set(ModelByTypeAndName.key(modelType, entry.fields.name), entry);
    }
  }

  get<T>(modelType: cms.ModelType, name: string): Entry<T> | undefined {
    return this.map.get(ModelByTypeAndName.key(modelType, name));
  }

  clear(): void {
    this.map.clear();
  }
  private static key(modelType: cms.ModelType, name: string): string {
    return name + '@' + modelType;
  }
}

/**
 * Contents are only cached because searching for keywords would require making many calls per user text input
 * (one per each ngram of length 1, 2, 3 at least) and we wouldn't be able to normalize, remove stopwords, ...
 * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
 * for API rate limits
 *
 * See https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/ for query reference
 */
export class CachedDeliveryApi implements DeliveryApi {
  private readonly refreshIfNecessary: <T>() => Promise<undefined>;
  private readonly byName = new ModelByTypeAndName();
  private readonly byId = new Map<string, Entry<any>>();
  constructor(readonly client: ContentfulClientApi, cacheTtlInMs: number) {
    let options: memoize.Options = { maxAge: cacheTtlInMs, preFetch: 0.33 };
    this.refreshIfNecessary = memoize(this.refresh, options);
    if (core.isNode()) {
      // AWS lambda charges per data transfer as normal ec2 (https://aws.amazon.com/lambda/pricing/)
      // which is very low https://aws.amazon.com/ec2/pricing/on-demand/
      // Example of a small bot: 19 texts, 2 carousels weights ~ 300k
      // If we update every 10s, 24*60*60*30/10 * 300k = 77Gb/month
      // But lambda only charges per data OUT to internet, so if the request is 1k => it would be ~300kb/month,
      // and they only charge ~0.1$ per GB
      // we can afford refreshing every 10s
      // this.refreshIfNecessary = memoize(this.refresh);
      // setTimeout(this.refreshIfNecessary, cacheTtlInMs);
    } else {
      // otherwise, only refresh when bot is active (in case we're eg. on mobile device)
    }
  }

  async getEntry<T>(id: string): Promise<Entry<T>> {
    await this.refreshIfNecessary();
    let entry = this.byId.get(id);
    return this.manageNotFound(entry, { id });
  }

  async getEntryByIdOrName<T>(
    idOrName: string,
    contentType: cms.ModelType
  ): Promise<Entry<T>> {
    await this.refreshIfNecessary();
    let entry = this.byId.get(idOrName);
    if (entry) {
      return entry as Entry<T>;
    }
    entry = this.byName.get<T>(contentType, idOrName);
    return this.manageNotFound(entry, { idOrName, contentType });
  }

  private async manageNotFound<T>(
    entry: Entry<T> | undefined,
    searchingFor: any
  ): Promise<Entry<T>> {
    if (!entry && searchingFor.id) {
      entry = await this.client.getEntry(searchingFor.id);
    }
    if (!entry) {
      throw new ContentNotFoundException('When looking for ' + searchingFor);
    }
    return entry;
  }

  private async refresh(): Promise<undefined> {
    this.byId.clear();
    this.byName.clear();

    // content_type[in] ='text.carousel' causes a 400
    for (let typ of ModelByTypeAndName.CACHED_TYPES) {
      let entries = await this.client.getEntries({
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: typ,
        include: 1
      });
      console.log(
        `refreshed contentful of type ${typ} for size ${sizeof(entries)}`
      );
      for (let entry of entries.items) {
        this.byName.set(entry);
        this.byId.set(entry.sys.id, entry);
      }
    }
    return undefined;
  }
}
