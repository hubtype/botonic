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
} from './contents'

export enum ModelType {
  CAROUSEL = 'carousel',
  CHITCHAT = 'chitchat',
  DATE_RANGE = 'dateRange',
  IMAGE = 'image',
  QUEUE = 'queue',
  TEXT = 'text',
  URL = 'url',
  SCHEDULE = 'schedule',
  STARTUP = 'startUp',
}

export const MODEL_TYPES = Object.values(ModelType).map(m => m as ModelType)

export function isSameModel(model1: ModelType, model2: ModelType): boolean {
  switch (model1) {
    case ModelType.TEXT:
    case ModelType.CHITCHAT:
      return model2 == ModelType.TEXT || model2 == ModelType.CHITCHAT
    default:
      return model1 == model2
  }
}

/**
 * Except for {@link contents} and {@link contentsWithKeywords}, when {@link Context.locale} is specified it will default
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
   * For contents with 'Seachable by' field (eg. {@link Queue}), it returns one result per each 'Seachable by' entry
   * @param context If locale specified, it does not return contents without values for the locale (even if it has value for the fallback locale)
   */
  contentsWithKeywords(context?: Context): Promise<SearchResult[]>
  schedule(id: string): Promise<ScheduleContent>
  dateRange(id: string): Promise<DateRangeContent>
  asset(id: string): Promise<Asset>
}
