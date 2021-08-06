import { ConnectionEvent } from './connections'
import { CarouselMessageEvent } from './message/carousel'
import { CustomMessageEvent } from './message/custom'
import { LocationMessageEvent } from './message/location'
import {
  AudioMessageEvent,
  DocumentMessageEvent,
  ImageMessageEvent,
  VideoMessageEvent,
} from './message/media'
import { PostbackMessageEvent } from './message/postback'
import { TextMessageEvent } from './message/text'
export declare enum EventTypes {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ACK = 'ack',
  TRACK = 'track',
}
export interface BaseEvent {
  eventId: string
  userId: string
  eventType: EventTypes
  createdAt: string
  modifiedAt?: string
}
export declare type BotonicEvent =
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
