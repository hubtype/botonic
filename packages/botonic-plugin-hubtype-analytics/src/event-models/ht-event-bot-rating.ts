import {
  BaseEventData,
  EventBotRating,
  EventDataBotRating,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotRating extends HtEvent {
  event_data: BaseEventData & EventDataBotRating

  constructor(event: EventBotRating, requestData: RequestData) {
    super(event, requestData)
    this.event_data.rating = event.event_data.rating
    this.event_data.free_comment = event.event_data.free_comment
    this.event_data.selected_options = event.event_data.selected_options
  }
}
