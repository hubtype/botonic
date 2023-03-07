import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithReference } from './reference'

export class ImageDelivery extends DeliveryWithReference {
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
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Image(
        await this.getReference().commonFields(entry, context),
        this.urlFromAssetRequired(entry.fields.image)
      ),
      entry.fields,
      referenceDelivery,
      ['image']
    )
  }
}

export interface ImageFields extends CommonEntryFields {
  image: contentful.Asset
}
