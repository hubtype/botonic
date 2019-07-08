import { SearchResult } from '../search/search-result';
import * as time from '../time';
import { Context } from './context';
import {
  Asset,
  Carousel,
  Image,
  Text,
  Url,
  Chitchat,
  Queue,
  Content
} from './contents';

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  CHITCHAT = 'chitchat',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload',
  SCHEDULE = 'schedule',
  DATE_RANGE = 'dateRange',
  IMAGE = 'image',
  ASSET = 'asset',
  QUEUE = 'queue'
}

export const MODEL_TYPES = Object.values(ModelType).map(m => m as ModelType);

export function isSameModel(model1: ModelType, model2: ModelType): boolean {
  switch (model1) {
    case ModelType.TEXT:
    case ModelType.CHITCHAT:
      return model2 == ModelType.TEXT || model2 == ModelType.CHITCHAT;
    default:
      return model1 == model2;
  }
}

/**
 * Except for {@link contents} and {@link contentsWithKeywords}, when {@link Context.locale} is specified it will default
 * to the fallback locale for those fields not available in the specified locale.
 */
export interface CMS {
  carousel(id: string, context?: Context): Promise<Carousel>;
  text(id: string, context?: Context): Promise<Text>;
  chitchat(id: string, context?: Context): Promise<Chitchat>;
  url(id: string, context?: Context): Promise<Url>;
  image(id: string, context?: Context): Promise<Image>;
  queue(id: string, context?: Context): Promise<Queue>;
  /**
   * @param context If locale specified, it does not returns contents without values for the locale (even if it has value for the fallback locale)
   */
  contents(model: ModelType, context?: Context): Promise<Content[]>;

  /**
   * For contents with 'Seachable by' field (eg. {@link Queue}), it returns one result per each 'Seachable by' entry
   * @param context If locale specified, it does not returns contents without values for the locale (even if it has value for the fallback locale)
   */
  contentsWithKeywords(context?: Context): Promise<SearchResult[]>;
  schedule(id: string): Promise<time.Schedule>;
  dateRange(id: string): Promise<time.DateRange>;
  asset(id: string): Promise<Asset>;
}
