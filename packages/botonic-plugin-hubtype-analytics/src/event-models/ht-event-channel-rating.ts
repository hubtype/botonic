import { EventChannelRating, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventChannelRating extends HtEvent {
  rating: number

  constructor(event: EventChannelRating, requestData: RequestData) {
    super(event, requestData)
    this.rating = event.event_data.rating
  }
}
