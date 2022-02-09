import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithFollowUp } from './follow-up'

export class VideoDelivery extends DeliveryWithFollowUp {
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
    return addCustomFields(
      new cms.Video(
        await this.getFollowUp().commonFields(entry, context),
        this.urlFromAssetRequired(entry.fields.video)
      ),
      entry.fields,
      ['video']
    )
  }
}

export interface VideoFields extends CommonEntryFields {
  video: contentful.Asset
}
