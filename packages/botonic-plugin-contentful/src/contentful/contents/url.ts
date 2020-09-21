import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryWithFollowUp } from './follow-up'
import * as contentful from 'contentful'
import { CommonEntryFields, DeliveryApi } from '../delivery-api'

export class UrlDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.URL, delivery, resumeErrors)
  }

  async url(id: string, context: Context): Promise<cms.Url> {
    const entry: contentful.Entry<UrlFields> = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  async fromEntry(entry: contentful.Entry<UrlFields>, context: Context) {
    return new cms.Url(
      await this.getFollowUp().commonFields(entry, context),
      entry.fields.url || ''
    )
  }
}

export interface UrlFields extends CommonEntryFields {
  url?: string
}
