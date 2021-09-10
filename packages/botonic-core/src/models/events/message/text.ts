import { WithButtons } from './buttons'
import { BotonicMessageEvent, MessageEventTypes } from './message-event'
import { WithReplies } from './replies'

export interface TextMessageEvent
  extends BotonicMessageEvent,
    WithReplies,
    WithButtons {
  type: MessageEventTypes.TEXT
  markdown: boolean
  text: string
}
