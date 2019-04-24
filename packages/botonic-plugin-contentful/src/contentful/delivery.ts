import { ModelType } from '../cms';
import * as contentful from 'contentful';
import { Entry } from 'contentful';

export class Delivery {
  private client: contentful.ContentfulClientApi;

  /**
   *
   * @param timeoutMs does not work at least when there's no network
   * during the first connection
   *
   * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
   * for API rate limits
   */
  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    this.client = contentful.createClient({
      space: spaceId,
      accessToken: accessToken,
      timeout: timeoutMs
    });
  }

  async getEntry<T>(id: string): Promise<Entry<T>> {
    return this.client.getEntry<T>(id);
  }

  static getContentModel<T>(entry: Entry<T>): ModelType {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    const typ = entry.sys.contentType.sys.id;
    return typ as ModelType;
  }
}
