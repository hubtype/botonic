import { EventDataHandoff, EventHandoffSuccess, RequestData } from '../types'
import { BaseHtEventData, HtEvent } from './ht-event'

export class HtEventHandoffSuccess extends HtEvent {
  data: BaseHtEventData & EventDataHandoff

  constructor(event: EventHandoffSuccess, requestData: RequestData) {
    super(event, requestData)
    this.data.queue_open = event.data.queue_open
    this.data.queue_id = event.data.queue_id
    this.data.available_agents = event.data.available_agents
    this.data.threshold_reached = event.data.threshold_reached
  }
}
