import * as contentful from 'contentful'

import {
  CmsException,
  CommonFields,
  ContentId,
  ContentType,
  DateRangeContent,
  FollowUp,
  SearchableBy,
} from '../cms'
import { ContentfulOptions } from '../plugin'
import * as time from '../time'
import {
  SearchableByKeywordsDelivery,
  SearchableByKeywordsFields,
} from './search/searchable-by'

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
  static getContentId<T extends ContentType = ContentType>(
    entry: contentful.Entry<any>
  ): ContentId {
    return new ContentId(
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
    const typ = entry.sys.contentType.sys.id
    return typ as T
  }

  static commonFieldsFromEntry(
    entry: contentful.Entry<CommonEntryFields>,
    followUp?: FollowUp
  ): CommonFields {
    const fields = entry.fields

    const searchableBy =
      fields.searchableBy &&
      new SearchableBy(
        fields.searchableBy.map(searchableBy =>
          SearchableByKeywordsDelivery.fromEntry(searchableBy)
        )
      )

    const dateRange =
      fields.dateRange &&
      ContentfulEntryUtils.fromDateRangeEntry(fields.dateRange)

    return new CommonFields(entry.sys.id, fields.name || '', {
      keywords: fields.keywords,
      shortText: fields.shortText,
      partitions: fields.partitions,
      searchableBy,
      dateRange,
      followUp,
    })
  }

  /** Cannot be in date-range to avoid circular dependency */
  static fromDateRangeEntry(
    entry: contentful.Entry<DateRangeFields>
  ): DateRangeContent {
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

export function createContentfulClientApi(
  options: ContentfulOptions
): contentful.ContentfulClientApi {
  const params: contentful.CreateClientParams = {
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

/** Cannot be in date-range to avoid circular dependency */
export interface DateRangeFields extends CommonEntryFields {
  from: string
  to: string
}
