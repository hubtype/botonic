import { BotonicMessageEvent, MessageEventType } from '.'
import { WithReplies } from './replies'

export interface CustomMessageEvent
  extends BotonicMessageEvent<MessageEventType.custom>,
    WithReplies {
  type: MessageEventType.custom
  customTypeName: string
}
