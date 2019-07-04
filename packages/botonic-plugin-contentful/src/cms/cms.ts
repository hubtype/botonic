import { SearchResult } from '../search/search-result';
import * as time from '../time';
import { CallbackMap } from './callback';
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

export class Context {
  constructor(readonly callbacks = new CallbackMap()) {}
}

export interface CMS {
  carousel(id: string, context?: Context): Promise<Carousel>;
  text(id: string, context?: Context): Promise<Text>;
  chitchat(id: string, context?: Context): Promise<Chitchat>;
  url(id: string): Promise<Url>;
  image(id: string): Promise<Image>;
  contentsWithKeywords(): Promise<SearchResult[]>;
  schedule(id: string): Promise<time.Schedule>;
  dateRange(id: string): Promise<time.DateRange>;
  asset(id: string): Promise<Asset>;
  queue(id: string): Promise<Queue>;
  contents(model: ModelType): Promise<Content[]>;
}
