import { EventAction, EventType, EventWebviewEnd, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventWebviewEnd extends HtEvent {
  action: EventAction.WebviewEnd
  flow_thread_id?: string
  webview_thread_id: string
  webview_name: string
  webview_end_step_name?: string
  webview_end_step_n?: number
  webview_end_fail_type?: string
  webview_end_fail_message?: string

  constructor(event: EventWebviewEnd, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.WebEvent
    this.action = event.action
    this.flow_thread_id = event.flowThreadId
    this.webview_thread_id = event.webviewThreadId
    this.webview_name = event.webviewName
    this.webview_end_step_name = event.webviewStepName
    this.webview_end_step_n = event.webviewStepNumber
    this.webview_end_fail_type = event.webviewEndFailType
    this.webview_end_fail_message = event.webviewEndFailMessage
  }
}
