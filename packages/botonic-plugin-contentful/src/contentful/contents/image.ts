import * as cms from '../../cms'
import { Context } from '../../cms'
import { CommonEntryFields, DeliveryApi } from '../delivery-api'
import * as contentful from 'contentful'
import { DeliveryWithFollowUp } from './follow-up'

export class ImageDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.IMAGE, delivery, resumeErrors)
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
      this.urlFromAssetRequired(entry.fields.image)
    )
  }
}

export interface ImageFields extends CommonEntryFields {
  image: contentful.Asset
}
