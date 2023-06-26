import { EventHandoffSuccess, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventHandoffSuccess extends HtEvent {
  queue_open: boolean
  available_agents: boolean
  threshold_reached: boolean

  constructor(event: EventHandoffSuccess, requestData: RequestData) {
    super(event, requestData)
    this.queue_open = event.event_data.queue_open
    this.available_agents = event.event_data.available_agents
    this.threshold_reached = event.event_data.threshold_reached
  }
}
