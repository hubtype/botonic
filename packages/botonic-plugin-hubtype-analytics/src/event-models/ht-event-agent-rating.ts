import { EventAgentRating, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventAgentRating extends HtEvent {
  rating: number

  constructor(event: EventAgentRating, requestData: RequestData) {
    super(event, requestData)
    this.rating = event.event_data.rating
  }
}
