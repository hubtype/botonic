import * as time from '../time/schedule';
import { CallbackMap } from './callback';
import { Carousel, ContentWithKeywords, Text, Url } from './model';

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
  contentsWithKeywords(): Promise<ContentWithKeywords[]>;
  schedule(id: string): Promise<time.Schedule>;
}
