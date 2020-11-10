import * as contentful from 'contentful'

import { Context } from '../../cms'
import * as cms from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import { CommonEntryFields, ContentfulEntryUtils } from '../delivery-utils'
import { ScheduleDelivery, ScheduleFields } from './schedule'

export class QueueDelivery extends TopContentDelivery {
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
    return this.fromEntry(entry)
  }

  fromEntry(entry: contentful.Entry<QueueFields>): cms.Queue {
    const fields = entry.fields

    const schedule = fields.schedule && this.schedule.fromEntry(fields.schedule)

    return new cms.Queue(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      fields.queue,
      schedule && schedule.schedule
    )
  }
}

export interface QueueFields extends CommonEntryFields {
  queue: string
  schedule?: contentful.Entry<ScheduleFields>
}
