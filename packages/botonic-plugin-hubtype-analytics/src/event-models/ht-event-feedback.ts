import { EventAction, EventFeedback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataFeedback {
  action:
    | EventAction.FeedbackCase
    | EventAction.FeedbackConversation
    | EventAction.FeedbackMessage
    | EventAction.FeedbackWebview
  feedback_target_id?: string
  feedback_group_id?: string
  possible_options: string[]
  possible_values: number[]
  option: string
  value: number
}

export class HtEventFeedback extends HtEvent {
  data: EventDataFeedback

  constructor(event: EventFeedback, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.Feedback
    this.data.feedback_target_id = event.data.feedbackTargetId // ?? case_id, message_id, conversation_id ???, webview_name
    this.data.feedback_group_id = event.data.feedbackGroupId // ??
    this.data.possible_options = event.data.possibleOptions
    this.data.possible_values = event.data.possibleValues
    this.data.option = event.data.option
    this.data.value = event.data.value
  }
}
