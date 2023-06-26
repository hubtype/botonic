import { EventBotAiModel, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotAiModel extends HtEvent {
  intent: string
  confidence: number
  confidence_successful: boolean

  constructor(event: EventBotAiModel, requestData: RequestData) {
    super(event, requestData)
    this.intent = event.event_data.intent
    this.confidence = event.event_data.confidence
    this.confidence_successful = event.event_data.confidence_successful
  }
}
