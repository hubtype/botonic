import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithReference } from './reference'

export class VideoDelivery extends DeliveryWithReference {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.VIDEO, delivery, resumeErrors)
  }

  async video(id: string, context: Context): Promise<cms.Video> {
    const entry: contentful.Entry<VideoFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<VideoFields>,
    context: cms.Context
  ): Promise<cms.Video> {
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Video(
        await this.getReference().commonFields(entry, context),
        this.urlFromAssetRequired(entry.fields.video)
      ),
      entry.fields,
      referenceDelivery,
      ['video']
    )
  }
}

export interface VideoFields extends CommonEntryFields {
  video: contentful.Asset
}
