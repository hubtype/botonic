import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Context } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithFollowUp } from './follow-up'

export class PayloadDelivery extends DeliveryWithFollowUp {
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

  async fromEntry(entry: contentful.Entry<PayloadFields>, context: Context) {
    return addCustomFields(
      new cms.Payload(
        await this.getFollowUp().commonFields(entry, context),
        entry.fields.payload || ''
      ),
      entry.fields
    )
  }
}

export interface PayloadFields extends CommonEntryFields {
  payload: string
}
