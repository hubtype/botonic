import {
  CommonFields,
  Content,
  ContentType,
  Context,
  PagingOptions,
  TopContent,
  TopContentType,
} from '../../cms'
import * as contentful from 'contentful'
import { EntryCollection } from 'contentful'
import { QueueDelivery } from './queue'
import { ScheduleDelivery } from './schedule'
import { CommonEntryFields, ContentfulEntryUtils } from '../delivery-api'
import { ResourceDelivery } from '../content-delivery'

/**
 * Retrieve multiple contents in a single call
 */
export class ContentsDelivery extends ResourceDelivery {
  async contents<T extends Content>(
    contentType: ContentType,
    context: Context,
    factory: (entry: contentful.Entry<any>, ctxt: Context) => Promise<T>,
    paging: PagingOptions
  ): Promise<T[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.delivery.getEntries(
      context,
      this.query(contentType, paging)
    )
    return this.asyncMap(context, entryCollection.items, entry =>
      factory(entry, context)
    )
  }

  async topContents<T extends TopContent>(
    model: TopContentType,
    context: Context,
    factory: (entry: contentful.Entry<any>, ctxt: Context) => Promise<T>,
    filter: ((cf: CommonFields) => boolean) | undefined,
    paging: PagingOptions
  ): Promise<T[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.delivery.getEntries(
      context,
      this.query(model, paging)
    )
    let entries = entryCollection.items
    if (filter) {
      entries = entries.filter(entry =>
        filter(ContentfulEntryUtils.commonFieldsFromEntry(entry))
      )
    }
    return this.asyncMap(context, entries, entry => factory(entry, context))
  }

  private maxReferencesInclude() {
    return Math.max(
      QueueDelivery.REFERENCES_INCLUDE,
      ScheduleDelivery.REFERENCES_INCLUDE
    )
  }

  private query(contentType: ContentType, paging: PagingOptions) {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      content_type: contentType,
      include: this.maxReferencesInclude(),
      limit: paging.limit,
      skip: paging.skip,
    }
  }
}
