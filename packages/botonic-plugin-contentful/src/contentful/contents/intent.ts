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

export class IntentDelivery extends TopContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.INTENT, delivery, resumeErrors)
  }

  async intent(id: string, context: Context): Promise<cms.Intent> {
    const entry: contentful.Entry<IntentFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: contentful.Entry<IntentFields>, context: Context) {
    return addCustomFields(
      new cms.Intent(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        entry.fields.intent || ''
      ),
      entry.fields
    )
  }
}

export interface IntentFields extends CommonEntryFields {
  intent: string
}
