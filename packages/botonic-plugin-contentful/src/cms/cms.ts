import * as time from '../time/schedule';
import { CallbackMap } from './callback';
import {
  Carousel,
  CallbackToContentWithKeywords,
  Image,
  Text,
  Url
} from './contents';

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload',
  SCHEDULE = 'schedule',
  IMAGE = 'image'
}

export interface CMS {
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: CallbackMap): Promise<Text>;
  url(id: string): Promise<Url>;
  image(id: string): Promise<Image>;
  contentsWithKeywords(): Promise<CallbackToContentWithKeywords[]>;
  schedule(id: string): Promise<time.Schedule>;
}
