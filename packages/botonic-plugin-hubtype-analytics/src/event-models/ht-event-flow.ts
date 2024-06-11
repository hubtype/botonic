import { EventAction, EventFlow, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventFlow extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean

  constructor(event: EventFlow, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.FlowNode
    this.flow_thread_id = event.flowThreadId // This value is managed by the flow builder plugin, stored in the session and updated every time the content connected to the conversation start is displayed
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful || false
  }
}
