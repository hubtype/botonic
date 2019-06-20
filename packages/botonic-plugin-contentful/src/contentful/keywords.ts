import { Entry, EntryCollection } from 'contentful';
import * as cms from '../cms';
import { CallbackToContentWithKeywords } from '../cms';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async contentsWithKeywords(): Promise<CallbackToContentWithKeywords[]> {
    let entries = await this.getEntriesWithKeywords();
    return entries.map(entry => {
      let fields = entry.fields;
      let shortText = fields.shortText;
      let contentModel = DeliveryApi.getContentModel(entry);
      if (!shortText) {
        console.error(`No shortText found ${contentModel} ${fields.name}`);
        fields.shortText = fields.name;
      }
      return DeliveryApi.buildContentWithKeywords(entry);
    });
  }

  private async getEntriesWithKeywords(): Promise<
    Entry<ContentWithKeywordsFields>[]
  > {
    const getWithKeywords = (contentType: cms.ModelType) =>
      this.delivery.getEntries<ContentWithKeywordsFields>({
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.keywords[exists]': true,
        include: 0
      });
    let promises = [];
    for (let contentType of [
      cms.ModelType.CAROUSEL,
      cms.ModelType.TEXT,
      cms.ModelType.URL,
      cms.ModelType.QUEUE
    ]) {
      promises.push(getWithKeywords(contentType));
    }
    return Promise.all(promises).then(entryCollections =>
      KeywordsDelivery.flatMap(entryCollections)
    );
  }

  private static flatMap<T>(collections: EntryCollection<T>[]): Entry<T>[] {
    let entries = [] as Entry<T>[];
    collections.forEach(collection => entries.push(...collection.items));
    return entries;
  }
}
