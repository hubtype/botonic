import { SearchResult } from '../search/search-result'
import { Context } from './context'
import {
  Asset,
  Carousel,
  Image,
  Text,
  Url,
  Chitchat,
  Queue,
  StartUp,
  CommonFields,
  ScheduleContent,
  DateRangeContent,
  TopContent,
  Content,
} from './contents'

export enum MessageContentType {
  CAROUSEL = 'carousel',
  IMAGE = 'image',
  TEXT = 'text',
  CHITCHAT = 'chitchat', //so far it's an alias for TEXT
  STARTUP = 'startUp',
}
export const MESSAGE_TYPES = Object.values(MessageContentType).map(
  m => m as MessageContentType
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
export const TOPCONTENT_TYPES = Object.values(TopContentType).map(
  m => m as TopContentType
)

export enum SubContentType {
  BUTTON = 'button',
  ELEMENT = 'element',
}
export type ContentType = TopContentType | SubContentType
export const ContentType = { ...TopContentType, ...SubContentType }
export const CONTENT_TYPES = Object.values(ContentType).map(
  m => m as ContentType
)

export function isSameModel(model1: ContentType, model2: ContentType): boolean {
  switch (model1) {
    case ContentType.TEXT:
    case ContentType.CHITCHAT:
      return model2 == ContentType.TEXT || model2 == ContentType.CHITCHAT
    default:
      return model1 == model2
  }
}

/**
 * Except for {@link topContents} and {@link contentsWithKeywords}, when {@link Context.locale} is specified it will default
 * to the fallback locale for those fields not available in the specified locale.
 */
export interface CMS {
  carousel(id: string, context?: Context): Promise<Carousel>
  chitchat(id: string, context?: Context): Promise<Chitchat>
  image(id: string, context?: Context): Promise<Image>
  queue(id: string, context?: Context): Promise<Queue>
  startUp(id: string, context?: Context): Promise<StartUp>
  text(id: string, context?: Context): Promise<Text>
  url(id: string, context?: Context): Promise<Url>
  /**
   * If locale specified in context, it does not return contents without values for the locale (even if it has value for the fallback locale)
   */
  contents(
    model: ModelType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]>

  /**
   * TODO add filter by id or name
   */
  contents(contentType: ContentType, context?: Context): Promise<Content[]>

  /**
   * For contents with 'Searchable by' field (eg. {@link Queue}), it returns one result per each 'Seachable by' entry
   * @param context If locale specified, it does not return contents without values for the locale (even if it has value for the fallback locale)
   */
  contentsWithKeywords(context?: Context): Promise<SearchResult[]>
  schedule(id: string): Promise<ScheduleContent>
  dateRange(id: string): Promise<DateRangeContent>
  asset(id: string): Promise<Asset>
}
