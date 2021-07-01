import { ConnectionEvent } from './connections/index'
import { CarouselMessageEvent } from './message/carousel'
import { CustomMessageEvent } from './message/custom'
import { LocationMessageEvent } from './message/location'
import { MediaMessageEvent } from './message/media'
import { TextMessageEvent } from './message/text'

export enum EventTypes {
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ACK = 'ack',
  TRACK = 'track',
}

export interface BaseEvent {
  id: string
  eventType: typeof EventTypes[keyof typeof EventTypes]
  createdAt: string
  modifiedAt?: string
}

export type BotonicEvent =
  | TextMessageEvent
  | MediaMessageEvent
  | LocationMessageEvent
  | CarouselMessageEvent
  | CustomMessageEvent
  | ConnectionEvent
