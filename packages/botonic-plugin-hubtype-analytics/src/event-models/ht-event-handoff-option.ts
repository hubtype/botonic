import { EventAction, EventHandoff, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataHandoffOption {
  action: EventAction.HandoffOption
  handoff_queue_id: string
  handoff_queue_name: string
}

export class HtEventHandoffOption extends HtEvent {
  data: EventDataHandoffOption

  constructor(event: EventHandoff, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.data.handoff_queue_id = event.data.queueId
    this.data.handoff_queue_name = event.data.queueName
  }
}
