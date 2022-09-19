import * as contentful from 'contentful'

import {
  ContentType,
  Context,
  DateRangeContent,
  DEFAULT_CONTEXT,
} from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  ContentfulEntryUtils,
  DateRangeFields,
} from '../delivery-utils'
import { DeliveryWithReference } from './reference'

export class DateRangeDelivery extends DeliveryWithReference {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(ContentType.DATE_RANGE, delivery, resumeErrors)
  }

  async dateRange(id: string, context: Context): Promise<DateRangeContent> {
    const entry: contentful.Entry<DateRangeFields> = await this.getEntry(
      id,
      DEFAULT_CONTEXT
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<DateRangeFields>,
    context: Context
  ): Promise<DateRangeContent> {
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      ContentfulEntryUtils.fromDateRangeEntry(entry),
      entry.fields,
      referenceDelivery,
      ['from', 'to']
    )
  }
}
