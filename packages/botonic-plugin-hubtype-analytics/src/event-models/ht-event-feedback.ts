import { EventAction, EventFeedback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataFeedback {
  action:
    | EventAction.feedbackCase
    | EventAction.feedbackConversation
    | EventAction.feedbackMessage
    | EventAction.feedbackWebview
  message_generated_by?: string
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
    this.type = EventType.feedback
    this.data.message_generated_by = event.data.messageGeneratedBy // ?? nomes te valor quan action es message. Si es message de knowledge base => sources y chunks. Quan es un node de flow builder => content_id
    this.data.feedback_target_id = event.data.feedbackTargetId // ?? case_id, message_id, conversation_id ???, webview_name
    this.data.feedback_group_id = event.data.feedbackGroupId // ??
    this.data.possible_options = event.data.possibleOptions
    this.data.possible_values = event.data.possibleValues
    this.data.option = event.data.option
    this.data.value = event.data.value
  }
}
