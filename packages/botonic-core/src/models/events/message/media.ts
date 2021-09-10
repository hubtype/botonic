import { WithButtons } from './buttons'
import { BotonicMessageEvent, MessageEventTypes } from './message-event'

export const MEDIA_TYPES = [
  MessageEventTypes.AUDIO,
  MessageEventTypes.IMAGE,
  MessageEventTypes.DOCUMENT,
  MessageEventTypes.VIDEO,
]
export interface MediaMessageEvent extends BotonicMessageEvent, WithButtons {
  src: string
}

export interface AudioMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.AUDIO
}

export interface ImageMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.IMAGE
}

export interface DocumentMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.DOCUMENT
}

export interface VideoMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.VIDEO
}
