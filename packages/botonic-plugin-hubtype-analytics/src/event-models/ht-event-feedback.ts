import { EventDataFeedback, EventFeedback, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventFeedback extends HtEvent {
  data: EventDataFeedback

  constructor(event: EventFeedback, requestData: RequestData) {
    super(event, requestData)
    this.data = event.data
    // this.data.action = event.data.action
    // this.data.message_generated_by = event.data.message_generated_by
    // this.data.feedback_target_id = event.data.feedback_target_id
    // this.data.feedback_group_id = event.data.feedback_group_id
    // this.data.possible_options = event.data.possible_options
    // this.data.possible_values = event.data.possible_values
    // this.data.option = event.data.option
    // this.data.value = event.data.value
  }
}
