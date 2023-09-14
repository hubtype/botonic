import {
  BaseEventData,
  EventBotFaq,
  EventDataBotFaq,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotFaq extends HtEvent {
  event_data: BaseEventData & EventDataBotFaq

  constructor(event: EventBotFaq, requestData: RequestData) {
    super(event, requestData)
    this.event_data.faq_name = event.event_data.faq_name
  }
}
