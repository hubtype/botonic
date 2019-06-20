import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentWithNameFields, DeliveryApi } from './delivery-api';
import { ScheduleFields, ScheduleDelivery } from './schedule';
import {
  SearchableByKeywordsDelivery,
  SearchableByKeywordsFields
} from './searchable-by';

export class QueueDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async queue(id: string): Promise<cms.Queue> {
    let entry: contentful.Entry<QueueFields> = await this.delivery.getEntry(
      id,
      { include: ScheduleDelivery.REFERENCES_INCLUDE + 1 }
    );
    return QueueDelivery.fromEntry(entry);
  }

  static fromEntry(entry: contentful.Entry<QueueFields>): cms.Queue {
    let fields = entry.fields;
    let name = fields.name;
    console.log('sched del', fields.schedule);

    let schedule =
      fields.schedule && ScheduleDelivery.scheduleFromEntry(fields.schedule);

    let searchableBy =
      fields.searchableBy &&
      fields.searchableBy.map(searchableBy =>
        SearchableByKeywordsDelivery.fromEntry(searchableBy)
      );
    return new cms.Queue(
      name,
      fields.shortText,
      fields.queue,
      schedule,
      new cms.SearchableBy(searchableBy)
    );
  }
}

export interface QueueFields extends ContentWithNameFields {
  shortText: string;
  queue: string;
  schedule?: contentful.Entry<ScheduleFields>;
  searchableBy?: contentful.Entry<SearchableByKeywordsFields>[];
}
