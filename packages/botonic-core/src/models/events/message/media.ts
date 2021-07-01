import { BotonicMessageEvent, MessageEventTypes } from '.'
import { WithButtons } from './buttons'

interface MediaMessageEvent extends BotonicMessageEvent, WithButtons {
  src: string
}

export interface AudioMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.AUDIO
  src: string
}

export interface ImageMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.IMAGE
  src: string
}

export interface DocumentMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.DOCUMENT
  src: string
}

export interface VideoMessageEvent extends MediaMessageEvent {
  type: MessageEventTypes.VIDEO
  src: string
}
