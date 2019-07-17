import { Context } from '../cms';
import * as cms from '../cms';
import { ContentDelivery } from './content-delivery';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';
import * as contentful from 'contentful/index';

export class ImageDelivery extends ContentDelivery {
  constructor(delivery: DeliveryApi) {
    super(cms.ModelType.IMAGE, delivery);
  }

  async image(id: string, context: Context): Promise<cms.Image> {
    let entry: contentful.Entry<ImageFields> = await this.getEntry(id, context);
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
