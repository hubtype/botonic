import {
  type EventAction,
  type EventHandoff,
  EventType,
  type RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventHandoff extends HtEvent {
  action: EventAction.HandoffSuccess | EventAction.HandoffFail
  flow_thread_id?: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  handoff_queue_id: string
  handoff_queue_name: string
  handoff_case_id?: string
  handoff_is_queue_open: boolean
  handoff_is_available_agent: boolean
  handoff_is_threshold_reached: boolean

  constructor(event: EventHandoff, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = event.action
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.handoff_queue_id = event.queueId
    this.handoff_queue_name = event.queueName
    this.handoff_case_id = event.caseId
    this.handoff_is_queue_open = event.isQueueOpen || false
    this.handoff_is_available_agent = event.isAvailableAgent || false
    this.handoff_is_threshold_reached = event.isThresholdReached || false
  }
}
