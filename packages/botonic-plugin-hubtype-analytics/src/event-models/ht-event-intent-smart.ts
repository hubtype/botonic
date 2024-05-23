import { EventIntentSmart, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export interface EventDataIntentSmart {
  nlu_intent_smart_label: string
  nlu_intent_smart_num_used: number
  nlu_intent_smart_message_id: string
}

export class HtEventIntentSmart extends HtEvent {
  data: EventDataIntentSmart

  constructor(event: EventIntentSmart, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.flow
    this.data.nlu_intent_smart_label = event.data.nluIntentSmartLabel
    this.data.nlu_intent_smart_num_used = event.data.nluIntentSmartNumUsed
    this.data.nlu_intent_smart_message_id = event.data.nluIntentSmartMessageId
  }
}
