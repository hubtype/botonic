import * as contentful from 'contentful'

import { ContentType, DateRangeContent, DEFAULT_CONTEXT } from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  ContentfulEntryUtils,
  DateRangeFields,
} from '../delivery-utils'

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
    return addCustomFields(
      ContentfulEntryUtils.fromDateRangeEntry(entry),
      entry.fields,
      ['from', 'to']
    )
  }
}
