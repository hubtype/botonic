import { BotonicMessageEvent, MessageEventTypes } from '.'
import { WithButtons } from './buttons'
import { WithReplies } from './replies'

export interface TextMessageEvent
  extends BotonicMessageEvent,
    WithReplies,
    WithButtons {
  type: MessageEventTypes.TEXT
  markdown: boolean
  text: string
}
