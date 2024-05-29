import { EventAction, EventType, EventWebview, RequestData } from '../types'
import { HtEvent } from './ht-event'

interface EventDataWebview {
  action: EventAction.WebviewStep | EventAction.WebviewEnd
  webview_thread_id: string
  webview_name: string
  webview_step_name?: string
  webview_end_fail_type?: string
  webview_end_fail_message?: string
}

export class HtEventWebview extends HtEvent {
  data: EventDataWebview

  constructor(event: EventWebview, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.Webevent
    this.data.webview_thread_id = event.data.webviewThreadId
    this.data.webview_name = event.data.webviewName
    this.data.webview_step_name = event.data.webviewStepName
    this.data.webview_end_fail_type = event.data.webviewEndFailType
    this.data.webview_end_fail_message = event.data.webviewEndFailMessage
  }
}
