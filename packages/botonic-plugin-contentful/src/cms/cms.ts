import * as time from '../time/schedule';
import { CallbackMap } from './callback';
import { Carousel, ContentCallbackWithKeywords, Text, Url } from './contents';

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload',
  SCHEDULE = 'schedule'
}

export interface CMS {
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: CallbackMap): Promise<Text>;
  url(id: string): Promise<Url>;
  contentsWithKeywords(): Promise<ContentCallbackWithKeywords[]>;
  schedule(id: string): Promise<time.Schedule>;
}
