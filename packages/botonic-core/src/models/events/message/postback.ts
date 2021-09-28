import { BotonicMessageEvent } from './message-event'

export interface PostbackMessageEvent extends BotonicMessageEvent {
  payload: string
}
