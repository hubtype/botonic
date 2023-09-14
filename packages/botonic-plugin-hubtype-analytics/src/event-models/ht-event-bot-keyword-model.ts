import {
  BaseEventData,
  EventBotKeywordModel,
  EventDataBotKeywordModel,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotKeywordModel extends HtEvent {
  event_data: BaseEventData & EventDataBotKeywordModel

  constructor(event: EventBotKeywordModel, requestData: RequestData) {
    super(event, requestData)
    this.event_data.confidence_successful =
      event.event_data.confidence_successful
  }
}
