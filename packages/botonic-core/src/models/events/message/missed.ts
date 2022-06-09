import { BotonicMessageEvent } from './message-event'

export interface MissedMessageEvent extends BotonicMessageEvent {
  reason: string
  media_type?: string
}
