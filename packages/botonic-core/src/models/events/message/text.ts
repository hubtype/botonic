import { BotonicMessageEvent, MessageEventType } from '.'
import { WithButtons } from './buttons'
import { WithReplies } from './replies'

export interface TextMessageEvent
  extends BotonicMessageEvent<MessageEventType.text>,
    WithReplies,
    WithButtons {
  markdown: boolean
  text: string
}
