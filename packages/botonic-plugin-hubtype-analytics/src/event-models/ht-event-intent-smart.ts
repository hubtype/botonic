import { EventAction, EventIntentSmart, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataIntentSmart {
  action: EventAction.IntentSmart
  nlu_intent_smart_title: string
  nlu_intent_smart_num_used: number
  nlu_intent_smart_message_id: string
}

export class HtEventIntentSmart extends HtEvent {
  data: EventDataIntentSmart

  constructor(event: EventIntentSmart, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.Botevent
    this.data.nlu_intent_smart_title = event.data.nluIntentSmartTitle
    this.data.nlu_intent_smart_num_used = event.data.nluIntentSmartNumUsed
    this.data.nlu_intent_smart_message_id = event.data.nluIntentSmartMessageId
  }
}
