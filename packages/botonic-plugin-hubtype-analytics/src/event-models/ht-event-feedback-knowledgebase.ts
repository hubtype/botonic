import {
  EventAction,
  EventFeedbackKnowledgebase,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventFeedbackKnowledgebase extends HtEvent {
  action: EventAction.FeedbackKnowledgebase
  knowledgebase_inference_id: string
  feedback_target_id: string
  feedback_group_id: string
  possible_options: string[]
  possible_values?: number[]
  option: string
  value?: number
  comment?: string

  constructor(event: EventFeedbackKnowledgebase, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.WebEvent
    this.action = event.action
    this.knowledgebase_inference_id = event.knowledgebaseInferenceId
    this.feedback_target_id = event.feedbackTargetId
    this.feedback_group_id = event.feedbackGroupId
    this.possible_options = event.possibleOptions
    this.possible_values = event.possibleValues
    this.option = event.option
    this.value = event.value
    this.comment = event.comment
  }
}
