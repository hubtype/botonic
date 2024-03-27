import * as contentful from 'contentful'
import { CreateClientParams } from 'contentful'

import { CmsException, ContentId, ContentType, Context } from '../cms'
import { ContentfulOptions } from '../plugin'
import { ReducedClientApi } from './delivery/client-api'
import { convertContentfulException, DateRangeFields } from './delivery-utils'
import { SearchableByKeywordsFields } from './search/searchable-by'

/**
 * https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
 */
export interface DeliveryApi {
  getAsset(id: string, context: Context, query?: any): Promise<contentful.Asset>

  getAssets(context: Context, query?: any): Promise<contentful.AssetCollection>

  getEntry<T>(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Entry<T>>

  getEntries<T>(
    context: Context,
    query?: any
  ): Promise<contentful.EntryCollection<T>>

  getContentType(id: string): Promise<contentful.ContentType>

  getOptions(): ContentfulOptions
}

/**
 * Manages the {@link Context}, parses Content's Id and ContentType from the Contentful entries...
 */
export class AdaptorDeliveryApi implements DeliveryApi {
  constructor(
    readonly client: ReducedClientApi,
    readonly options: ContentfulOptions
  ) {}

  async getAsset(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Asset> {
    return this.client.getAsset(id, this.queryFromContext(context, query))
  }

  async getAssets(
    context: Context,
    query?: any
  ): Promise<contentful.AssetCollection> {
    return this.client.getAssets(this.queryFromContext(context, query))
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(id, this.queryFromContext(context, query))
  }

  async getEntries<T>(
    context: Context,
    query: any = {}
  ): Promise<contentful.EntryCollection<T>> {
    try {
      return this.client.getEntries<T>(this.queryFromContext(context, query))
    } catch (e) {
      throw convertContentfulException(e, query)
    }
  }

  async getContentType(id: string): Promise<contentful.ContentType> {
    try {
      return this.client.getContentType(id)
    } catch (e) {
      console.error(`ERROR in getContentType for id ${id}:`, e)
      throw e
    }
  }

  getOptions(): ContentfulOptions {
    return this.options
  }

  private queryFromContext(context: Context, query: any = {}): any {
    const locale = this.options.cmsLocale
      ? this.options.cmsLocale(context.locale)
      : context.locale
    if (locale) {
      query['locale'] = locale
    }
    return query
  }
}

export interface ContentWithNameFields {
  // The content code (eg. PRE_FAQ1) Not called Id to differentiate from contentful automatic Id
  name: string
}

export interface CommonEntryFields extends ContentWithNameFields {
  // Useful to display in buttons or reports
  shortText?: string
  keywords?: string[]
  searchableBy?: contentful.Entry<SearchableByKeywordsFields>[]
  partitions?: string[]
  dateRange?: contentful.Entry<DateRangeFields>
  followup?: contentful.Entry<FollowUpFields>
}
export type FollowUpFields = CommonEntryFields

export class ContentfulEntryUtils {
  static getContentId(entry: contentful.Entry<any>): ContentId {
    return ContentId.create(
      ContentfulEntryUtils.getContentModel(entry),
      entry.sys.id
    )
  }

  /**
   * Will be false for broken references, or when we have only fetched
   * the full Entry tree
   */
  static isFullEntry(entry: contentful.Entry<any>): boolean {
    return !!entry.fields
  }

  static getContentModel<T extends ContentType = ContentType>(
    entry: contentful.Entry<any>
  ): T {
    // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
    if (!entry.sys.contentType) {
      throw new CmsException(
        `Entry '${entry.sys.id}' not fully loaded or referencing a deleted content`
      )
    }
    return entry.sys.contentType.sys.id as T
  }
}

export function createContentfulClientApi(
  options: ContentfulOptions
): contentful.ContentfulClientApi {
  const params: CreateClientParams = {
    space: options.spaceId,
    accessToken: options.accessToken,
    timeout: options.timeoutMs,
  }
  if (options.environment) {
    params.environment = options.environment
  }
  const client = contentful.createClient(params)
  return client
}
