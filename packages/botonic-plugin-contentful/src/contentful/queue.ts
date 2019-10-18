import { Context } from '../cms';
import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentDelivery } from './content-delivery';
import {
  commonFieldsFromEntry,
  CommonEntryFields,
  DeliveryApi
} from './delivery-api';
import { ScheduleFields, ScheduleDelivery } from './schedule';

export class QueueDelivery extends ContentDelivery {
  static REFERENCES_INCLUDE = ScheduleDelivery.REFERENCES_INCLUDE + 1;

  constructor(delivery: DeliveryApi) {
    super(cms.ModelType.QUEUE, delivery);
  }

  async queue(id: string, context: Context): Promise<cms.Queue> {
    const entry: contentful.Entry<QueueFields> = await this.getEntry(
      id,
      context,
      { include: QueueDelivery.REFERENCES_INCLUDE }
    );
    return QueueDelivery.fromEntry(entry);
  }

  static fromEntry(entry: contentful.Entry<QueueFields>): cms.Queue {
    const fields = entry.fields;

    const schedule =
      fields.schedule && ScheduleDelivery.fromEntry(fields.schedule);

    return new cms.Queue(
      commonFieldsFromEntry(entry),
      fields.queue,
      schedule && schedule.schedule
    );
  }
}

export interface QueueFields extends CommonEntryFields {
  queue: string;
  schedule?: contentful.Entry<ScheduleFields>;
}
