import { EventFaqUseful, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventFaqUseful extends HtEvent {
  faq_name: string
  useful: boolean

  constructor(event: EventFaqUseful, requestData: RequestData) {
    super(event, requestData)
    this.faq_name = event.event_data.faq_name
    this.useful = event.event_data.useful
  }
}
