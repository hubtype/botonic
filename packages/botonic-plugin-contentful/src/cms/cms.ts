import { SearchCandidate } from '../search/search-result'
import { Context } from './context'
import {
  Asset,
  Button,
  Carousel,
  Chitchat,
  CommonFields,
  Content,
  DateRangeContent,
  Element,
  Image,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  Url,
} from './contents'

export enum MessageContentType {
  CAROUSEL = 'carousel',
  IMAGE = 'image',
  TEXT = 'text',
  CHITCHAT = 'chitchat', //so far it's an alias for TEXT
  STARTUP = 'startUp',
}

// CHITCHAT removed because it's an alias for texts
export const MESSAGE_CONTENT_TYPES = Object.values(MessageContentType).filter(
  m => m != MessageContentType.CHITCHAT
)

export enum NonMessageTopContentType {
  DATE_RANGE = 'dateRange',
  QUEUE = 'queue',
  URL = 'url',
  SCHEDULE = 'schedule',
}

export type TopContentType = MessageContentType | NonMessageTopContentType
export const TopContentType = {
  ...MessageContentType,
  ...NonMessageTopContentType,
}
export const TOP_CONTENT_TYPES = [
  ...MESSAGE_CONTENT_TYPES,
  ...Object.values(NonMessageTopContentType),
]

export enum SubContentType {
  BUTTON = 'button',
  ELEMENT = 'element',
}
export type ContentType = TopContentType | SubContentType
export const ContentType = { ...TopContentType, ...SubContentType }
export const CONTENT_TYPES = [
  ...TOP_CONTENT_TYPES,
  ...Object.values(SubContentType),
]

export type BotonicContentType = MessageContentType | SubContentType
export const BotonicContentType = { ...MessageContentType, ...SubContentType }
export const BOTONIC_CONTENT_TYPES = [
  ...MESSAGE_CONTENT_TYPES,
  ...Object.values(SubContentType),
]

export function isSameModel(model1: ContentType, model2: ContentType): boolean {
  switch (model1) {
    case ContentType.TEXT:
    case ContentType.CHITCHAT:
      return model2 == ContentType.TEXT || model2 == ContentType.CHITCHAT
    default:
      return model1 == model2
  }
}

export class PagingOptions {
  constructor(readonly limit = 1000, readonly skip = 0) {}
}

/**
 * Except for {@link topContents} and {@link contentsWithKeywords}, when {@link Context.locale} is specified it will default
 * to the fallback locale for those fields not available in the specified locale.
 * TODO split in several interfaces. One only for delivering single Content? or only MessageContents? Rename to Delivery
 */
export interface CMS {
  button(id: string, context?: Context): Promise<Button>

  /**
   * If ContentfulOptions.resumeErrors is set:
   * - If any image cannot be retrieved, it will be left undefined
   * - If any element cannot be retrieved, only the rest will be returned
   */
  carousel(id: string, context?: Context): Promise<Carousel>

  chitchat(id: string, context?: Context): Promise<Chitchat>
  element(id: string, context?: Context): Promise<Element>

  /** Even if ContentfulOptions.resumeErrors is set, if the asset is not available
   * the method will fail. */
  image(id: string, context?: Context): Promise<Image>
  queue(id: string, context?: Context): Promise<Queue>

  /**
   * If ContentfulOptions.resumeErrors is set: If the image cannot be retrieved,
   * it will be left undefined
   */
  startUp(id: string, context?: Context): Promise<StartUp>
  text(id: string, context?: Context): Promise<Text>
  url(id: string, context?: Context): Promise<Url>

  /**
   * If locale specified in context, it does not return contents without values for the locale (even if it has value for the fallback locale)
   *
   * If ContentfulOptions.resumeErrors is set: if some contents fail to be devilered,
   * an error will be displayed but the result will be returned.
   */
  topContents<T extends TopContent>(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<T[]>

  content(id: string, context?: Context): Promise<Content>

  /**
   * If ContentfulOptions.resumeErrors is set: if some contents fail to be delivered,
   * an error will be displayed but the result will be returned.
   */
  contents<T extends Content>(
    contentType: ContentType,
    context?: Context,
    paging?: PagingOptions
  ): Promise<T[]>

  assets(context?: Context, paging?: PagingOptions): Promise<Asset[]>

  /**
   * For contents with 'Searchable by' field (eg. {@link Queue}), it returns one result per each 'Seachable by' entry
   * @param context If locale specified, it does not return contents without values for the locale (even if it has value for the fallback locale)
   */
  contentsWithKeywords(context?: Context): Promise<SearchCandidate[]>
  schedule(id: string, context?: Context): Promise<ScheduleContent>
  dateRange(id: string, context?: Context): Promise<DateRangeContent>
  asset(id: string, context?: Context): Promise<Asset>
}
