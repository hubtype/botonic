import { EventAction, EventIntentSmart, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventIntentSmart extends HtEvent {
  nlu_intent_smart_title: string
  nlu_intent_smart_num_used: number
  nlu_intent_smart_message_id: string
  user_input: string
  flow_thread_id: string
  flow_id: string
  flow_node_id: string

  constructor(event: EventIntentSmart, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.IntentSmart
    this.nlu_intent_smart_title = event.nluIntentSmartTitle
    this.nlu_intent_smart_num_used = event.nluIntentSmartNumUsed
    this.nlu_intent_smart_message_id = event.nluIntentSmartMessageId
    this.user_input = event.userInput
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_node_id = event.flowNodeId
  }
}
