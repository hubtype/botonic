import { EventAction, EventFlow, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataFlow {
  action: EventAction.FlowNode
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
}

export class HtEventFlow extends HtEvent {
  data: EventDataFlow

  constructor(event: EventFlow, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.Botevent
    this.data.flow_thread_id = event.data.flowThreadId // This value is managed by the flow builder plugin, stored in the session and updated every time the content connected to the conversation start is displayed
    this.data.flow_id = event.data.flowId
    this.data.flow_name = event.data.flowName
    this.data.flow_node_id = event.data.flowNodeId
    this.data.flow_node_content_id = event.data.flowNodeContentId
    this.data.flow_node_is_meaningful = event.data.flowNodeIsMeaningful || false
  }
}
