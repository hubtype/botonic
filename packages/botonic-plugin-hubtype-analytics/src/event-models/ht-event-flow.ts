import { EventFlow, FlowAction, RequestData } from '../types'
import { HtEvent } from './ht-event'

export interface EventDataFlow {
  action: FlowAction
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful?: boolean
}

export class HtEventFlow extends HtEvent {
  data: EventDataFlow

  constructor(event: EventFlow, requestData: RequestData) {
    super(event, requestData)
    this.data = {} as EventDataFlow
    this.data.action = event.data.action
    this.data.flow_thread_id = event.data.flowThreadId // guarda en la sessio, s'ha d'actualitzar cada cop que es pasa pel flow node de conversation start
    this.data.flow_id = event.data.flowId
    this.data.flow_name = event.data.flowName
    this.data.flow_node_id = event.data.flowNodeId
    this.data.flow_node_content_id = event.data.flowNodeContentId
    this.data.flow_node_is_meaningful = event.data.flowNodeIsMeaningful || false
  }
}
