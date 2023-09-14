import {
  BaseEventData,
  EventDataUseful,
  EventFaqUseful,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventFaqUseful extends HtEvent {
  event_data: BaseEventData & EventDataUseful

  constructor(event: EventFaqUseful, requestData: RequestData) {
    super(event, requestData)
    this.event_data.faq_name = event.event_data.faq_name
    this.event_data.useful = event.event_data.useful
  }
}
