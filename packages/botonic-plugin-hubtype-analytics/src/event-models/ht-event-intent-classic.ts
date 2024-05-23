import {
  EventAction,
  EventIntentClassic,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

interface EventDataIntentClassic {
  action: EventAction.intentClassic
  nlu_intent_label: string
  nlu_intent_id: string
  nlu_intent_confidence: number
  nlu_intent_threshold: number
  nlu_intent_message_id: string
}

export class HtEventIntentClassic extends HtEvent {
  data: EventDataIntentClassic

  constructor(event: EventIntentClassic, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.flow
    this.data.nlu_intent_label = event.data.nluIntentLabel
    this.data.nlu_intent_id = event.data.nluIntentId
    this.data.nlu_intent_confidence = event.data.nluIntentConfidence
    this.data.nlu_intent_threshold = event.data.nluIntentThreshold
    this.data.nlu_intent_message_id = event.data.nluIntentMessageId
  }
}
