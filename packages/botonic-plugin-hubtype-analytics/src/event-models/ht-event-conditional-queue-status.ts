import {
  EventAction,
  type EventConditionalQueueStatus,
  EventType,
  type RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventConditionalQueueStatus extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  queue_id: string
  queue_name: string
  is_queue_open: boolean
  is_available_agent: boolean

  constructor(event: EventConditionalQueueStatus, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.ConditionalQueueStatus
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful
    this.queue_id = event.queueId
    this.queue_name = event.queueName
    this.is_queue_open = event.isQueueOpen
    this.is_available_agent = event.isAvailableAgent
  }
}
