import * as contentful from 'contentful'

import { ContentType, DateRangeContent, DEFAULT_CONTEXT } from '../../cms'
import * as time from '../../time'
import { TopContentDelivery } from '../content-delivery'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DeliveryApi,
} from '../delivery-api'

export class DateRangeDelivery extends TopContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(ContentType.DATE_RANGE, delivery, resumeErrors)
  }

  async dateRange(id: string): Promise<DateRangeContent> {
    const entry: contentful.Entry<DateRangeFields> = await this.getEntry(
      id,
      DEFAULT_CONTEXT
    )
    return DateRangeDelivery.fromEntry(entry)
  }

  static fromEntry(entry: contentful.Entry<DateRangeFields>): DateRangeContent {
    const dateRange = new time.DateRange(
      entry.fields.name,
      new Date(Date.parse(entry.fields.from)),
      new Date(Date.parse(entry.fields.to))
    )
    return new DateRangeContent(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      dateRange
    )
  }
}

export interface DateRangeFields extends CommonEntryFields {
  from: string
  to: string
}
