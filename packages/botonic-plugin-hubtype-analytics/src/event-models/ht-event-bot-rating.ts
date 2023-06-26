import { EventBotRating, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotRating extends HtEvent {
  rating: number
  free_comment?: string
  selected_options?: string[]

  constructor(event: EventBotRating, requestData: RequestData) {
    super(event, requestData)
    this.rating = event.event_data.rating
    this.free_comment = event.event_data.free_comment
    this.selected_options = event.event_data.selected_options
  }
}
