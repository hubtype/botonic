import { SearchResult } from '../search/search-result';
import * as time from '../time/schedule';
import { CallbackMap } from './callback';
import { Asset, Carousel, Image, Text, Url, Chitchat, Queue ,
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
  IMAGE = 'image',
  ASSET = 'asset',
  QUEUE = 'queue'
}

export interface CMS {
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: CallbackMap): Promise<Text>;
  chitchat(id: string, callbacks?: CallbackMap): Promise<Chitchat>;
  url(id: string): Promise<Url>;
  image(id: string): Promise<Image>;
  contentsWithKeywords(): Promise<SearchResult[]>;
  schedule(id: string): Promise<time.Schedule>;
  asset(id: string): Promise<Asset>;
  queue(id: string): Promise<Queue>;
  contents(model: ModelType): Promise<Content[]>;
}
