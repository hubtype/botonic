import { BotonicMessageEvent, MessageEventType } from '.'
import { WithButtons } from './buttons'

export interface AudioMessageEvent
  extends BotonicMessageEvent<MessageEventType.audio>,
    WithButtons {
  src: string
}

export interface ImageMessageEvent
  extends BotonicMessageEvent<MessageEventType.image>,
    WithButtons {
  src: string
}

export interface DocumentMessageEvent
  extends BotonicMessageEvent<MessageEventType.document>,
    WithButtons {
  src: string
}

export interface VideoMessageEvent
  extends BotonicMessageEvent<MessageEventType.video>,
    WithButtons {
  src: string
}

export type MediaMessageEvent =
  | AudioMessageEvent
  | ImageMessageEvent
  | DocumentMessageEvent
  | VideoMessageEvent
