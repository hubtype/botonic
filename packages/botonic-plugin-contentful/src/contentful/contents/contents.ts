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
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DeliveryApi,
} from '../delivery-api'
import { asyncMap } from '../../util/async'

/**
 * Retrieve multiple contents in a single call
 */
export class ContentsDelivery {
  constructor(readonly api: DeliveryApi) {}

  async contents(
    contentType: ContentType,
    context: Context,
    factory: (entry: contentful.Entry<any>, ctxt: Context) => Promise<Content>,
    paging = new PagingOptions()
  ): Promise<Content[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.api.getEntries(
      context,
      this.query(contentType, paging)
    )
    return asyncMap(context, entryCollection.items, entry =>
      factory(entry, context)
    )
  }

  async topContents(
    model: TopContentType,
    context: Context,
    factory: (
      entry: contentful.Entry<any>,
      ctxt: Context
    ) => Promise<TopContent>,
    filter?: (cf: CommonFields) => boolean,
    paging = new PagingOptions()
  ): Promise<TopContent[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.api.getEntries(
      context,
      this.query(model, paging)
    )
    let entries = entryCollection.items
    if (filter) {
      entries = entries.filter(entry =>
        filter(ContentfulEntryUtils.commonFieldsFromEntry(entry))
      )
    }
    return asyncMap(context, entries, entry => factory(entry, context))
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
