import { EventAction, EventType, EventWebviewStep, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventWebviewStep extends HtEvent {
  action: EventAction.WebviewStep
  flow_thread_id?: string
  webview_thread_id: string
  webview_name: string
  webview_step_name: string
  webview_step_n: number

  constructor(event: EventWebviewStep, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.WebEvent
    this.action = event.action
    this.flow_thread_id = event.flowThreadId
    this.webview_thread_id = event.webviewThreadId
    this.webview_name = event.webviewName
    this.webview_step_name = event.webviewStepName
    this.webview_step_n = event.webviewStepNumber
  }
}
