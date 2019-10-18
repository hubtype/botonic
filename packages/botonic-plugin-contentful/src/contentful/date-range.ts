import * as contentful from 'contentful/index';
import { DateRangeContent, DEFAULT_CONTEXT, ModelType } from '../cms';
import * as time from '../time';
import { ContentDelivery } from './content-delivery';
import {
  CommonEntryFields,
  commonFieldsFromEntry,
  DeliveryApi
} from './delivery-api';

export class DateRangeDelivery extends ContentDelivery {
  constructor(delivery: DeliveryApi) {
    super(ModelType.DATE_RANGE, delivery);
  }

  async dateRange(id: string): Promise<DateRangeContent> {
    const entry: contentful.Entry<DateRangeFields> = await this.getEntry(
      id,
      DEFAULT_CONTEXT
    );
    return DateRangeDelivery.fromEntry(entry);
  }

  static fromEntry(entry: contentful.Entry<DateRangeFields>): DateRangeContent {
    const dateRange = new time.DateRange(
      entry.fields.name,
      new Date(Date.parse(entry.fields.from)),
      new Date(Date.parse(entry.fields.to))
    );
    return new DateRangeContent(commonFieldsFromEntry(entry), dateRange);
  }
}

export interface DateRangeFields extends CommonEntryFields {
  from: string;
  to: string;
}
