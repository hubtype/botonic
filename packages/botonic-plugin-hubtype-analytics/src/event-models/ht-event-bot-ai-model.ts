import { EventBotAiModel, EventDataBotAiModel, RequestData } from '../types'
import { BaseHtEventData, HtEvent } from './ht-event'

export class HtEventBotAiModel extends HtEvent {
  data: BaseHtEventData & EventDataBotAiModel

  constructor(event: EventBotAiModel, requestData: RequestData) {
    super(event, requestData)
    this.data.intent = event.data.intent
    this.data.confidence = event.data.confidence
    this.data.confidence_successful = event.data.confidence_successful
  }
}
