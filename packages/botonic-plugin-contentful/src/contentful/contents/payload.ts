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

export class PayloadDelivery extends DeliveryWithReference {
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
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Payload(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        entry.fields.payload || ''
      ),
      entry.fields,
      referenceDelivery
    )
  }
}

export interface PayloadFields extends CommonEntryFields {
  payload: string
}
