import { BotonicMessageEvent, MessageEventTypes } from '.'
import { WithButtons } from './buttons'

export interface AudioMessageEvent extends BotonicMessageEvent, WithButtons {
  type: MessageEventTypes.AUDIO
  src: string
}

export interface ImageMessageEvent extends BotonicMessageEvent, WithButtons {
  type: MessageEventTypes.IMAGE
  src: string
}

export interface DocumentMessageEvent extends BotonicMessageEvent, WithButtons {
  type: MessageEventTypes.DOCUMENT
  src: string
}

export interface VideoMessageEvent extends BotonicMessageEvent, WithButtons {
  type: MessageEventTypes.VIDEO
  src: string
}

export type MediaMessageEvent =
  | AudioMessageEvent
  | ImageMessageEvent
  | DocumentMessageEvent
  | VideoMessageEvent
