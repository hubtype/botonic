import { Context } from '../cms'
import * as cms from '../cms'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DeliveryApi,
} from './delivery-api'
import * as contentful from 'contentful/index'
import { DeliveryWithFollowUp } from './follow-up'

export class ImageDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi) {
    super(cms.ContentType.IMAGE, delivery)
  }

  async image(id: string, context: Context): Promise<cms.Image> {
    const entry: contentful.Entry<ImageFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<ImageFields>,
    context: cms.Context
  ): Promise<cms.Image> {
    return new cms.Image(
      await this.getFollowUp().commonFields(entry, context),
      ContentfulEntryUtils.urlFromAsset(entry.fields.image)
    )
  }
}

export interface ImageFields extends CommonEntryFields {
  image: contentful.Asset
}
