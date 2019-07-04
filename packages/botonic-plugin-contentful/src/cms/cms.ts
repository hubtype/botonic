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

export interface CMS {
  carousel(id: string, context?: Context): Promise<Carousel>;
  text(id: string, context?: Context): Promise<Text>;
  chitchat(id: string, context?: Context): Promise<Chitchat>;
  url(id: string, context?: Context): Promise<Url>;
  image(id: string, context?: Context): Promise<Image>;
  queue(id: string, context?: Context): Promise<Queue>;
  contents(model: ModelType, context?: Context): Promise<Content[]>;
  contentsWithKeywords(context?: Context): Promise<SearchResult[]>;
  schedule(id: string): Promise<time.Schedule>;
  dateRange(id: string): Promise<time.DateRange>;
  asset(id: string): Promise<Asset>;
}
