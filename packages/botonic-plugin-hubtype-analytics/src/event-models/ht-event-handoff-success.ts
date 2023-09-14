import {
  BaseEventData,
  EventDataHandoff,
  EventHandoffSuccess,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventHandoffSuccess extends HtEvent {
  event_data: BaseEventData & EventDataHandoff

  constructor(event: EventHandoffSuccess, requestData: RequestData) {
    super(event, requestData)
    this.event_data.queue_open = event.event_data.queue_open
    this.event_data.queue_id = event.event_data.queue_id
    this.event_data.available_agents = event.event_data.available_agents
    this.event_data.threshold_reached = event.event_data.threshold_reached
  }
}
