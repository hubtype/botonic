import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { DeliveryWithReference } from './reference'

export class UrlDelivery extends DeliveryWithReference {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.URL, delivery, resumeErrors)
  }

  async url(id: string, context: Context): Promise<cms.Url> {
    const entry: contentful.Entry<UrlFields> = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: contentful.Entry<UrlFields>, context: Context) {
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Url(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        entry.fields.url || ''
      ),
      entry.fields,
      referenceDelivery
    )
  }
}

export interface UrlFields extends CommonEntryFields {
  url?: string
}
