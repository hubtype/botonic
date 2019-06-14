import * as cms from '../cms';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';
import * as contentful from 'contentful/index';

export class ImageDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async image(id: string): Promise<cms.Image> {
    let entry: contentful.Entry<ImageFields> = await this.delivery.getEntry(id);
    return this.imageFromEntry(entry);
  }

  imageFromEntry(entry: contentful.Entry<ImageFields>): cms.Image {
    return new cms.Image(
      entry.fields.name,
      DeliveryApi.urlFromAsset(entry.fields.image)
    );
  }
}

export interface ImageFields extends ContentWithKeywordsFields {
  image: contentful.Asset;
}
