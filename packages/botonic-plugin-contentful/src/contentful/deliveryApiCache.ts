import { ContentfulClientApi, Entry } from 'contentful';
import { ContentNotFoundException } from '../cms';
import { getContentModel, DeliveryApi } from './deliveryApi';
import * as memoize from 'memoizee';
import * as cms from '../cms';

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

  private static key(modelType: cms.ModelType, name: string): string {
    return name + '@' + modelType;
  }
}

/**
 * Contents are only cached because searching for keywords would require making many calls per user text input
 * (one per each ngram of length 1, 2, 3 at least) and we wouldn't be able to normalize, remove stopwords, ...
 * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
 * for API rate limits
 */
export class CachedDeliveryApi implements DeliveryApi {
  private readonly refreshIfNecessary: <T>() => Promise<undefined>;
  private readonly byName = new ModelByTypeAndName();
  private readonly byId = new Map<string, Entry<any>>();
  constructor(readonly client: ContentfulClientApi, cacheTtlInMs: number) {
    let options: memoize.Options = { maxAge: cacheTtlInMs, preFetch: 0.33 };
    this.refreshIfNecessary = memoize(this.refresh, options);
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

  private manageNotFound<T>(
    entry: Entry<T> | undefined,
    searchingFor: any
  ): Promise<Entry<T>> {
    if (!entry) {
      throw new ContentNotFoundException('When looking for ' + searchingFor);
    }
    return Promise.resolve(entry);
  }

  private async refresh(): Promise<undefined> {
    console.log('refreshing contentful');
    let entries = await this.client.getEntries();
    for (let entry of entries.items) {
      this.byName.set(entry);
      this.byId.set(entry.sys.id, entry);
    }
    return undefined;
  }
}
