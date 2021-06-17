import { TextMessageEvent } from './message/text'
import { MediaMessageEvent } from './message/media'
import { LocationMessageEvent } from './message/location'
import { CarouselMessageEvent } from './message/carousel'
import { CustomMessageEvent } from './message/custom'
import { ConnectionEvent } from './connections/index'

export enum EventTypes {
  connection = 'connection',
  message = 'message',
  ack = 'ack',
  track = 'track',
}

export interface BaseEvent<EventType extends EventTypes> {
  id: string
  eventType: EventType
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
