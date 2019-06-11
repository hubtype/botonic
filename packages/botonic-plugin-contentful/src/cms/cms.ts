import * as time from '../time/schedule';
import { CallbackMap } from './callback';
import {
  Carousel,
  CallbackToContentWithKeywords,
  Image,
  Text,
  Url,
  Chitchat
} from './contents';

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  CHITCHAT = 'chitchat',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload',
  SCHEDULE = 'schedule',
  IMAGE = 'image'
}

export interface CMS {
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: CallbackMap): Promise<Text>;
  chitchat(id: string, callbacks?: CallbackMap): Promise<Chitchat>;
  url(id: string): Promise<Url>;
  image(id: string): Promise<Image>;
  contentsWithKeywords(): Promise<CallbackToContentWithKeywords[]>;
  schedule(id: string): Promise<time.Schedule>;
}
