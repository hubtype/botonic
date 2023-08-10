import {
  BaseEventData,
  EventAgentRating,
  EventDataRating,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventAgentRating extends HtEvent {
  event_data: BaseEventData & EventDataRating

  constructor(event: EventAgentRating, requestData: RequestData) {
    super(event, requestData)
    this.event_data.rating = event.event_data.rating
    this.event_data.commnent = event.event_data.commnent
    this.event_data.case_id = event.event_data.case_id
  }
}
