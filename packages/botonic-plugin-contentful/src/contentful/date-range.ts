import { DEFAULT_CONTEXT } from '../cms';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';
import * as contentful from 'contentful/index';
import * as time from '../time';

export class DateRangeDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async dateRange(id: string): Promise<time.DateRange> {
    let entry: contentful.Entry<DateRangeFields> = await this.delivery.getEntry(
      id,
      DEFAULT_CONTEXT
    );
    return DateRangeDelivery.dateRangeFromEntry(entry);
  }

  static dateRangeFromEntry(
    entry: contentful.Entry<DateRangeFields>
  ): time.DateRange {
    return new time.DateRange(
      entry.fields.name,
      new Date(Date.parse(entry.fields.from)),
      new Date(Date.parse(entry.fields.to))
    );
  }
}

export interface DateRangeFields extends ContentWithKeywordsFields {
  name: string;
  from: string;
  to: string;
}
