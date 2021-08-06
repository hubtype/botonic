import { BotonicMessageEvent, MessageEventTypes } from '.'
import { WithReplies } from './replies'
export interface CustomMessageEvent extends BotonicMessageEvent, WithReplies {
  type: MessageEventTypes.CUSTOM
  customTypeName: string
}
