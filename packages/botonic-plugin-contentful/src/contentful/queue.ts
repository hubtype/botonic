import { Context } from '../cms';
import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentDelivery } from './content-delivery';
import { ContentWithNameFields, DeliveryApi } from './delivery-api';
import { ScheduleFields, ScheduleDelivery } from './schedule';
import {
  SearchableByKeywordsDelivery,
  SearchableByKeywordsFields,
} from './searchable-by';

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
    const name = fields.name;
    console.log('sched del', fields.schedule);

    const schedule =
      fields.schedule && ScheduleDelivery.scheduleFromEntry(fields.schedule);

    const searchableBy =
      fields.searchableBy &&
      fields.searchableBy.map((searchableBy) =>
        SearchableByKeywordsDelivery.fromEntry(searchableBy)
      );
    return new cms.Queue(
      name,
      fields.shortText,
      fields.queue,
      schedule,
      new cms.SearchableBy(searchableBy),
      fields.indicationText
    );
  }
}

export interface QueueFields extends ContentWithNameFields {
  shortText: string;
  queue: string;
  schedule?: contentful.Entry<ScheduleFields>;
  searchableBy?: contentful.Entry<SearchableByKeywordsFields>[];
  indicationText?: string;
}
