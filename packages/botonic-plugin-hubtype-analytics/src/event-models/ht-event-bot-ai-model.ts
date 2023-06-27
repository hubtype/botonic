import {
  BaseEventData,
  EventBotAiModel,
  EventDataBotAiModel,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotAiModel extends HtEvent {
  event_data: BaseEventData & EventDataBotAiModel

  constructor(event: EventBotAiModel, requestData: RequestData) {
    super(event, requestData)
    this.event_data.intent = event.event_data.intent
    this.event_data.confidence = event.event_data.confidence
    this.event_data.confidence_successful =
      event.event_data.confidence_successful
  }
}
