import { Entry } from 'contentful';
import * as cms from '../cms';
import { ButtonsWithKeywords } from '../cms';
import { DeliveryApi } from './deliveryApi';
import { TextFields } from './text';

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async textsWithKeywordsAsButtons(): Promise<ButtonsWithKeywords[]> {
    let texts = await this.getTextsWithKeywords();
    return texts.map(text => {
      let fields = text.fields;
      let shortText = fields.shortText;
      if (!shortText) {
        console.error(`No shortText found Text ${fields.name}`);
        shortText = fields.name;
      }
      let button = new cms.Button(
        fields.name,
        shortText,
        cms.Callback.ofModel(cms.ModelType.TEXT, text.sys.id)
      );
      return new ButtonsWithKeywords(button, text.fields.keywords!);
    });
  }

  private async getTextsWithKeywords(): Promise<Entry<TextFields>[]> {
    let entries = await this.delivery.getEntries<TextFields>({
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: cms.ModelType.TEXT,
      'fields.keywords[exists]': true,
      include: 0
    });
    return entries.items;
  }
}
