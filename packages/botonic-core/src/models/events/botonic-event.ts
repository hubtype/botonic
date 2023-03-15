import { ConnectionEvent } from './connections'
import {
  AudioMessageEvent,
  CarouselMessageEvent,
  CustomMessageEvent,
  DocumentMessageEvent,
  FormMessageEvent,
  ImageMessageEvent,
  LocationMessageEvent,
  PostbackMessageEvent,
  TextMessageEvent,
  VideoMessageEvent,
} from './message'

export type BotonicEvent =
  | TextMessageEvent
  | PostbackMessageEvent
  | AudioMessageEvent
  | DocumentMessageEvent
  | ImageMessageEvent
  | VideoMessageEvent
  | LocationMessageEvent
  | CarouselMessageEvent
  | CustomMessageEvent
  | ConnectionEvent
  | FormMessageEvent
