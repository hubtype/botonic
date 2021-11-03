import { ConnectionEvent } from './connection'
import { IntegrationEvent } from './integration'
import {
  AudioMessageEvent,
  CarouselMessageEvent,
  CustomMessageEvent,
  DocumentMessageEvent,
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
  | IntegrationEvent
