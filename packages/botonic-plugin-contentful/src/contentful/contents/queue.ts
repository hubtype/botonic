import * as contentful from 'contentful'

import { Context } from '../../cms'
import * as cms from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { DeliveryWithReference } from './reference'
import { ScheduleDelivery, ScheduleFields } from './schedule'

export class QueueDelivery extends DeliveryWithReference {
  static REFERENCES_INCLUDE = ScheduleDelivery.REFERENCES_INCLUDE + 1

  constructor(
    delivery: DeliveryApi,
    private readonly schedule: ScheduleDelivery,
    resumeErrors: boolean
  ) {
    super(cms.ContentType.QUEUE, delivery, resumeErrors)
  }

  async queue(id: string, context: Context): Promise<cms.Queue> {
    const entry: contentful.Entry<QueueFields> = await this.getEntry(
      id,
      context,
      { include: QueueDelivery.REFERENCES_INCLUDE }
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<QueueFields>,
    context: cms.Context
  ): Promise<cms.Queue> {
    const fields = entry.fields

    const schedule =
      fields.schedule &&
      (await this.schedule.fromEntry(fields.schedule, context))
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Queue(
        ContentfulEntryUtils.commonFieldsFromEntry(entry),
        fields.queue,
        schedule && schedule.schedule,
        fields.handoffMessage
      ),
      fields,
      referenceDelivery
    )
  }
}

export interface QueueFields extends CommonEntryFields {
  queue: string
  schedule?: contentful.Entry<ScheduleFields>
  handoffMessage?: string
}
