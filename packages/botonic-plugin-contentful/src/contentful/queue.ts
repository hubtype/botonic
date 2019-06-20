import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';
import { ScheduleFields, ScheduleDelivery } from './schedule';

export class QueueDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async queue(id: string): Promise<cms.Queue> {
    let entry: contentful.Entry<QueueFields> = await this.delivery.getEntry(
      id,
      { include: ScheduleDelivery.REFERENCES_INCLUDE + 1 }
    );
    let fields = entry.fields;
    let name = fields.name;
    let schedule = undefined;
    console.log('sched del', fields.schedule);

    if (fields.schedule)
      schedule = ScheduleDelivery.scheduleFromEntry(fields.schedule);
    return new cms.Queue(name, fields.shortText, fields.keywords, schedule);
  }
}

export interface QueueFields extends ContentWithKeywordsFields {
  schedule?: contentful.Entry<ScheduleFields>;
}
