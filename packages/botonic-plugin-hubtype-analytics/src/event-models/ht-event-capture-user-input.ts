import {
  EventAction,
  EventCaptureUserInput,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventCaptureUserInput extends HtEvent {
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_thread_id: string
  flow_node_is_meaningful: boolean
  field_name: string
  user_input: string
  capture_success: boolean
  message_id: string

  constructor(event: EventCaptureUserInput, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.CaptureUserInput
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_thread_id = event.flowThreadId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful
    this.field_name = event.fieldName
    this.user_input = event.userInput
    this.capture_success = event.captureSuccess
    this.message_id = event.messageId
  }
}
