import { ConnectionEvent } from './connections/index'
import { CarouselMessageEvent } from './message/carousel'
import { CustomMessageEvent } from './message/custom'
import { LocationMessageEvent } from './message/location'
import {
  AudioMessageEvent,
  DocumentMessageEvent,
  ImageMessageEvent,
  VideoMessageEvent,
} from './message/media'
import { TextMessageEvent } from './message/text'

export enum EventTypes {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ACK = 'ack',
  TRACK = 'track',
}

export interface BaseEvent {
  id: string
  userId: string
  eventType: EventTypes
  createdAt: string
  modifiedAt?: string
}

export type BotonicEvent =
  | TextMessageEvent
  | AudioMessageEvent
  | DocumentMessageEvent
  | ImageMessageEvent
  | VideoMessageEvent
  | LocationMessageEvent
  | CarouselMessageEvent
  | CustomMessageEvent
  | ConnectionEvent
