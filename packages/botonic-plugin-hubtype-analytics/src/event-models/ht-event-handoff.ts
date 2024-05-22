import { EventHandoff, EventName, HandoffAction, RequestData } from '../types'
import { HtEvent } from './ht-event'

export interface EventDataHandoff {
  action: HandoffAction
  handoff_queue_id: string
  handoff_queue_name: string
  handoff_case_id?: string
  is_queue_open?: boolean
  handoff_is_available_agent?: boolean
  handoff_is_threshold_reached?: boolean
}

export class HtEventHandoff extends HtEvent {
  data: EventDataHandoff

  constructor(event: EventHandoff, requestData: RequestData) {
    super(event, requestData)
    this.type = EventName.flow
    this.data.handoff_queue_id = event.data.handoffQueueId
    this.data.handoff_queue_name = event.data.handoffQueueName
    this.data.handoff_case_id = event.data.handoffCaseId
    this.data.is_queue_open = event.data.isQueueOpen
    this.data.handoff_is_available_agent = event.data.handoffIsAvailableAgent
    this.data.handoff_is_threshold_reached =
      event.data.handoffIsThresholdReached
  }
}
