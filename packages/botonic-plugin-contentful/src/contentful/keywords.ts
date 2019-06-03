import { Entry } from 'contentful';
import * as cms from '../cms';
import { ContentCallbackWithKeywords } from '../cms';
import { ContentWithKeywordsFields, DeliveryApi } from './deliveryApi';

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async contentsWithKeywords(): Promise<ContentCallbackWithKeywords[]> {
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
    let texts = this.delivery.getEntries<ContentWithKeywordsFields>({
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: cms.ModelType.TEXT,
      'fields.keywords[exists]': true,
      include: 0
    });
    let carousels = this.delivery.getEntries<ContentWithKeywordsFields>({
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: cms.ModelType.CAROUSEL,
      'fields.keywords[exists]': true,
      include: 0
    });
    return Promise.all([texts, carousels]).then(e =>
      e[0].items.concat(e[1].items)
    );
  }
}
