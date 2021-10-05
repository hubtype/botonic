import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'

export class UrlDelivery extends TopContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.URL, delivery, resumeErrors)
  }

  async url(id: string, context: Context): Promise<cms.Url> {
    const entry: contentful.Entry<UrlFields> = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: contentful.Entry<UrlFields>, context: Context) {
    return addCustomFields(
      new cms.Url(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        entry.fields.url || ''
      ),
      entry.fields
    )
  }
}

export interface UrlFields extends CommonEntryFields {
  url?: string
}
