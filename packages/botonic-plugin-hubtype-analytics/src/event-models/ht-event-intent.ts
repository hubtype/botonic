import { EventAction, EventIntent, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventIntent extends HtEvent {
  nlu_intent_label: string
  nlu_intent_confidence: number
  nlu_intent_threshold: number
  nlu_intent_message_id: string
  user_input: string
  flow_thread_id: string
  flow_id: string
  flow_node_id: string

  constructor(event: EventIntent, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Intent
    this.nlu_intent_label = event.nluIntentLabel
    this.nlu_intent_confidence = event.nluIntentConfidence
    this.nlu_intent_threshold = event.nluIntentThreshold
    this.nlu_intent_message_id = event.nluIntentMessageId
    this.user_input = event.userInput
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_node_id = event.flowNodeId
  }
}
