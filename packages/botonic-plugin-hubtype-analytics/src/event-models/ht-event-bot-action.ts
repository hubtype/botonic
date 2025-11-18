import { EventAction, EventBotAction, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventBotAction extends HtEvent {
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  payload: string

  constructor(event: EventBotAction, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.BotAction
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.payload = event.payload
  }
}
