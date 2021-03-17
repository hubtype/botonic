import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithFollowUp } from './follow-up'

export class UrlDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.URL, delivery, resumeErrors)
  }

  async url(id: string, context: Context): Promise<cms.Url> {
    const entry: contentful.Entry<UrlFields> = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  async fromEntry(entry: contentful.Entry<UrlFields>, context: Context) {
    return addCustomFields(
      new cms.Url(
        await this.getFollowUp().commonFields(entry, context),
        entry.fields.url || ''
      ),
      entry.fields
    )
  }
}

export interface UrlFields extends CommonEntryFields {
  url?: string
}
