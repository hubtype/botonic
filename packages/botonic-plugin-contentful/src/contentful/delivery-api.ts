import * as contentful from 'contentful'
import { Entry, EntryCollection } from 'contentful'
import * as cms from '../cms'
import {
  Callback,
  CommonFields,
  Content,
  ContentCallback,
  ContentType,
  Context,
  SearchableBy,
  TopContent,
  TopContentType,
} from '../cms'
import { QueueDelivery } from './queue'
import { UrlFields } from './url'
import {
  SearchableByKeywordsDelivery,
  SearchableByKeywordsFields,
} from './searchable-by'
import { ScheduleDelivery } from './schedule'
import { DateRangeDelivery, DateRangeFields } from './date-range'
import { ReducedClientApi } from './delivery/client-api'

export interface DeliveryApi {
  getAsset(id: string, query?: any): Promise<contentful.Asset>

  getEntry<T>(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Entry<T>>

  getEntries<T>(
    context: Context,
    query?: any
  ): Promise<contentful.EntryCollection<T>>
}

/**
 * Manages the {@link Context}, parses Content's Id and ContentType from the Contentful entries...
 */
export class AdaptorDeliveryApi implements DeliveryApi {
  constructor(readonly client: ReducedClientApi) {}

  async getAsset(id: string, query?: any): Promise<contentful.Asset> {
    return this.client.getAsset(id, query)
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(
      id,
      AdaptorDeliveryApi.queryFromContext(context, query)
    )
  }

  async getEntries<T>(
    context: Context,
    query: any = {}
  ): Promise<contentful.EntryCollection<T>> {
    return this.client.getEntries<T>(
      AdaptorDeliveryApi.queryFromContext(context, query)
    )
  }

  private static queryFromContext(context: Context, query: any = {}): any {
    if (context.locale) {
      query['locale'] = context.locale
    }
    return query
  }
}

export class ContentsApi {
  constructor(readonly api: DeliveryApi) {}

  async contents(
    contentType: ContentType,
    context: Context,
    factory: (entry: contentful.Entry<any>, ctxt: Context) => Promise<Content>
  ): Promise<Content[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.api.getEntries(
      context,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        include: this.maxReferencesInclude(),
      }
    )
    return Promise.all(
      entryCollection.items.map(entry => factory(entry, context))
    )
  }

  async topContents(
    model: TopContentType,
    context: Context,
    factory: (
      entry: contentful.Entry<any>,
      ctxt: Context
    ) => Promise<TopContent>,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    const entryCollection: EntryCollection<CommonEntryFields> = await this.api.getEntries(
      context,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: model,
        include: this.maxReferencesInclude(),
      }
    )
    let entries = entryCollection.items
    if (filter) {
      entries = entries.filter(entry =>
        filter(ContentfulEntryUtils.commonFieldsFromEntry(entry))
      )
    }
    return Promise.all(entries.map(entry => factory(entry, context)))
  }

  private maxReferencesInclude() {
    return Math.max(
      QueueDelivery.REFERENCES_INCLUDE,
      ScheduleDelivery.REFERENCES_INCLUDE
    )
  }
}

export interface ContentWithNameFields {
  // The content code (eg. PRE_FAQ1) Not called Id to differentiate from contentful automatic Id
  name: string
}

export interface CommonEntryFields extends ContentWithNameFields {
  // Useful to display in buttons or reports
  shortText: string
  keywords?: string[]
  searchableBy?: contentful.Entry<SearchableByKeywordsFields>[]
  partitions?: string[]
  dateRange?: contentful.Entry<DateRangeFields>
  followup?: contentful.Entry<FollowUpFields>
}
export type FollowUpFields = CommonEntryFields

export class ContentfulEntryUtils {
  static getContentModel(entry: contentful.Entry<any>): cms.ContentType {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    const typ = entry.sys.contentType.sys.id
    return typ as cms.ContentType
  }

  static callbackFromEntry(entry: contentful.Entry<any>): Callback {
    const modelType = ContentfulEntryUtils.getContentModel(
      entry
    ) as TopContentType
    if (modelType === ContentType.URL) {
      return Callback.ofUrl((entry.fields as UrlFields).url)
    }
    return new ContentCallback(modelType, entry.sys.id)
  }

  static urlFromAsset(assetField: contentful.Asset): string {
    return 'https:' + assetField.fields.file.url
  }

  static commonFieldsFromEntry(entry: Entry<CommonEntryFields>): CommonFields {
    const fields = entry.fields

    const searchableBy =
      fields.searchableBy &&
      new SearchableBy(
        fields.searchableBy.map(searchableBy =>
          SearchableByKeywordsDelivery.fromEntry(searchableBy)
        )
      )

    const dateRange =
      fields.dateRange && DateRangeDelivery.fromEntry(fields.dateRange)

    return new CommonFields(entry.sys.id, fields.name, {
      keywords: fields.keywords,
      shortText: fields.shortText,
      partitions: fields.partitions,
      searchableBy,
      dateRange,
    })
  }
}
