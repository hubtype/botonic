import { EventAction, EventHandoff, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataHandoff {
  action: EventAction.HandoffSuccess | EventAction.HandoffFail
  handoff_queue_id: string
  handoff_queue_name: string
  handoff_case_id?: string
  handoff_is_queue_open: boolean
  handoff_is_available_agent: boolean
  handoff_is_threshold_reached: boolean
}

export class HtEventHandoff extends HtEvent {
  data: EventDataHandoff

  constructor(event: EventHandoff, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.data.handoff_queue_id = event.data.queueId
    this.data.handoff_queue_name = event.data.queueName
    this.data.handoff_case_id = event.data.caseId
    this.data.handoff_is_queue_open = event.data.isQueueOpen || false
    this.data.handoff_is_available_agent = event.data.isAvailableAgent || false
    this.data.handoff_is_threshold_reached =
      event.data.isThresholdReached || false
  }
}
