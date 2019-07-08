import * as contentful from 'contentful';
import * as cms from '../cms';
import { Callback, Content, ContentCallback, Context, ModelType } from '../cms';
import { QueueDelivery, QueueFields } from './queue';
import { UrlFields } from './url';

export class DeliveryApi {
  private client: contentful.ContentfulClientApi;

  /**
   *
   * @param timeoutMs does not work at least when there's no network
   * during the first connection
   *
   * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
   * for API rate limits
   *
   *  https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
   */
  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    this.client = contentful.createClient({
      space: spaceId,
      accessToken: accessToken,
      timeout: timeoutMs
    });
  }

  async getAsset(id: string, query?: any): Promise<contentful.Asset> {
    return this.client.getAsset(id, query);
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(
      id,
      DeliveryApi.queryFromContext(context, query)
    );
  }

  private static queryFromContext(context: Context, query: any = {}): any {
    if (context.locale) {
      query['locale'] = context.locale;
    }
    return query;
  }

  async getEntries<T>(
    context: Context,
    query?: any
  ): Promise<contentful.EntryCollection<T>> {
    return this.client.getEntries<T>(
      DeliveryApi.queryFromContext(context, query)
    );
  }

  static getContentModel(entry: contentful.Entry<any>): cms.ModelType {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    const typ = entry.sys.contentType.sys.id;
    return typ as cms.ModelType;
  }

  static callbackFromEntry(entry: contentful.Entry<any>): Callback {
    let modelType = this.getContentModel(entry);
    if (modelType === ModelType.URL) {
      return Callback.ofUrl((entry.fields as UrlFields).url);
    }
    return new ContentCallback(modelType, entry.sys.id);
  }

  static urlFromAsset(assetField: contentful.Asset): string {
    return 'https:' + assetField.fields.file.url;
  }

  async contents(model: ModelType, context: Context): Promise<Content[]> {
    if (model != ModelType.QUEUE) {
      throw new Error('CMS.contents only supports queue at the moment');
    }
    let entries = await this.getEntries(context, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: model,
      include: QueueDelivery.REFERENCES_INCLUDE // TODO change for other types
    });
    return entries.items.map(item =>
      QueueDelivery.fromEntry(item as contentful.Entry<QueueFields>)
    );
    //TODO switch with instanceof the model
    // if (model instanceof ModelType.QUEUE) {
    // }
    // switch (true) {
    //   case model instanceof ModelType.QUEUE:
    //     console.log('QUEUE');
    //     return QueueDelivery.fromEntry(entries);
    //   default:
    //     console.error('Content not implemented!');
    // }
  }
}

export interface ContentWithNameFields {
  // An ID (eg. PRE_FAQ1)
  name: string;
}

export interface ContentWithKeywordsFields extends ContentWithNameFields {
  // Useful to display in buttons or reports
  shortText: string;
  keywords: string[];
}
