import { EventBotFaq, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotFaq extends HtEvent {
  faq_name: string

  constructor(event: EventBotFaq, requestData: RequestData) {
    super(event, requestData)
    this.faq_name = event.event_data.faq_name
  }
}
