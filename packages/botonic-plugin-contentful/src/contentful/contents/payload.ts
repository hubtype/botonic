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

export class PayloadDelivery extends TopContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.PAYLOAD, delivery, resumeErrors)
  }

  async payload(id: string, context: Context): Promise<cms.Payload> {
    const entry: contentful.Entry<PayloadFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: contentful.Entry<PayloadFields>, context: Context) {
    return addCustomFields(
      new cms.Payload(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        entry.fields.payload || ''
      ),
      entry.fields
    )
  }
}

export interface PayloadFields extends CommonEntryFields {
  payload: string
}
