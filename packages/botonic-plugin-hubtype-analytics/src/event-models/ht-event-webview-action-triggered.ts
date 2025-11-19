import {
  EventAction,
  EventWebviewActionTriggered,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventOpenWebview extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  webview_name: string
  webview_target_id: string

  constructor(event: EventWebviewActionTriggered, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.WebviewActionTriggered
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.webview_name = event.webviewName
    this.webview_target_id = event.webviewTargetId
  }
}
