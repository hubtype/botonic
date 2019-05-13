import * as contentful from 'contentful';
import * as cms from '../cms';

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

  async getEntryByIdOrName<T>(
    id: string,
    contentType: string
  ): Promise<contentful.Entry<T>> {
    try {
      if (id.indexOf('_') >= 0) {
        let entries = await this.client.getEntries<T>({
          'fields.name': id,
          // eslint-disable-next-line @typescript-eslint/camelcase
          content_type: contentType
        });
        if (entries.total === 0) {
          throw new Error(`No entry with name ${id}`);
        }
        return entries.items[0];
      }
    } catch (error) {
      console.log(error);
    }
    return this.getEntry(id);
  }

  async getEntry<T>(id: string): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(id);
  }

  async getEntries<T>(query?: any): Promise<contentful.EntryCollection<T>> {
    return this.client.getEntries<T>(query);
  }

  static getContentModel(entry: contentful.Entry<any>): cms.ModelType {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    const typ = entry.sys.contentType.sys.id;
    return typ as cms.ModelType;
  }
}
