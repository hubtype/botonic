import * as contentful from 'contentful/index';
import { DEFAULT_CONTEXT, ModelType } from '../cms';
import * as time from '../time';
import { ContentDelivery } from './content-delivery';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';

export class DateRangeDelivery extends ContentDelivery {
  constructor(delivery: DeliveryApi) {
    super(ModelType.DATE_RANGE, delivery);
  }

  async dateRange(id: string): Promise<time.DateRange> {
    const entry: contentful.Entry<DateRangeFields> = await this.getEntry(
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
