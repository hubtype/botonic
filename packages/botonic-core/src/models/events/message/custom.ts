import { BotonicMessageEvent, MessageEventTypes } from './message-event'
import { WithReplies } from './replies'

export interface CustomMessageEvent extends BotonicMessageEvent, WithReplies {
  type: MessageEventTypes.CUSTOM
  json: any
}
