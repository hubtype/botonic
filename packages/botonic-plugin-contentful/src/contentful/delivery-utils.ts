import * as contentful from 'contentful'

import {
  CmsException,
  CommonFields,
  ContentId,
  ContentType,
  Context,
  DateRangeContent,
  FollowUp,
  SearchableBy,
  TopContent,
} from '../cms'
import { ResourceTypeNotFoundCmsException } from '../cms/exceptions'
import { ContentfulOptions } from '../plugin'
import * as time from '../time'
import { ReferenceDelivery } from './contents/reference'
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
export type ReferenceFields = CommonEntryFields

export class ContentfulEntryUtils {
  static getContentId(entry: contentful.Entry<any>): ContentId {
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
      //customFields cannot be easily told apart from standard fields until the content is created. see addCustomFields
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

export function convertContentfulException(e: any, query: any): any {
  const errors = e?.details?.errors
  if (
    Array.isArray(errors) &&
    errors.length &&
    errors[0].name === 'unknownContentType'
  ) {
    return new ResourceTypeNotFoundCmsException(
      query['content_type'] || 'not set',
      e
    )
  }
  return e
}

export type Reference = {
  delivery: ReferenceDelivery
  context: Context
}
//supported types: string, number and boolean
export async function addCustomFields<T extends TopContent>(
  content: T,
  entryFields: CommonEntryFields,
  referenceDelivery?: Reference,
  ignoreFields?: string[]
): Promise<T> {
  const customKeys = Object.keys(entryFields).filter(
    f =>
      !Object.keys(content).includes(f) &&
      !Object.keys(content.common).includes(f) &&
      !ignoreFields?.includes(f) &&
      //contentful: followup, plugin: followUp
      'followup' != f
  )
  for (const customKey of customKeys) {
    const customField = (entryFields as any)[customKey]
    if (isReferenceField(customField)) {
      if (referenceDelivery) {
        content.common.customFields[customKey] =
          await referenceDelivery.delivery.fromEntry(
            customField,
            referenceDelivery.context
          )
      } else {
        console.error(
          `Warning: entry with id ${content.common.id}: type ${content.contentType} can't have custom reference fields`
        )
      }
    } else {
      content.common.customFields[customKey] = (entryFields as any)[customKey]
    }
  }
  return content
}

export function isReferenceField(field: any): boolean {
  return field?.sys?.id
}
