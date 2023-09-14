import {
  BaseEventData,
  EventChannelRating,
  EventDataRating,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventChannelRating extends HtEvent {
  event_data: BaseEventData & EventDataRating

  constructor(event: EventChannelRating, requestData: RequestData) {
    super(event, requestData)
    this.event_data.rating = event.event_data.rating
  }
}
