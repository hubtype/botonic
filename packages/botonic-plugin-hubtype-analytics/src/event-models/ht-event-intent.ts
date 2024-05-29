import { EventAction, EventIntent, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataIntent {
  action: EventAction.Intent
  nlu_intent_label: string
  nlu_intent_confidence: number
  nlu_intent_threshold: number
  nlu_intent_message_id: string
}

export class HtEventIntent extends HtEvent {
  data: EventDataIntent

  constructor(event: EventIntent, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.Botevent
    this.data.nlu_intent_label = event.data.nluIntentLabel
    this.data.nlu_intent_confidence = event.data.nluIntentConfidence
    this.data.nlu_intent_threshold = event.data.nluIntentThreshold
    this.data.nlu_intent_message_id = event.data.nluIntentMessageId
  }
}
