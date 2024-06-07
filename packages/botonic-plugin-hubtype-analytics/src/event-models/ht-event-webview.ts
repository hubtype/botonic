import { EventAction, EventType, EventWebview, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventWebview extends HtEvent {
  action: EventAction.WebviewStep | EventAction.WebviewEnd
  webview_thread_id: string
  webview_name: string
  webview_step_name?: string
  webview_end_fail_type?: string
  webview_end_fail_message?: string

  constructor(event: EventWebview, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.WebEvent
    this.action = event.action
    this.webview_thread_id = event.webviewThreadId
    this.webview_name = event.webviewName
    this.webview_step_name = event.webviewStepName
    this.webview_end_fail_type = event.webviewEndFailType
    this.webview_end_fail_message = event.webviewEndFailMessage
  }
}
