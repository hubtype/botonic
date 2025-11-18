import { EventAction, EventOpenWebview, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventOpenWebview extends HtEvent {
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  webview_name: string

  constructor(event: EventOpenWebview, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.OpenWebview
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.webview_name = event.webviewName
  }
}
