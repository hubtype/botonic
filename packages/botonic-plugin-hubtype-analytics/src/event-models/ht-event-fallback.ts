import { EventAction, EventFallback, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventFallback extends HtEvent {
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  fallback_out: number
  fallback_message_id: string
  user_input: string

  constructor(event: EventFallback, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.Fallback
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.user_input = event.userInput
    this.fallback_out = event.fallbackOut
    this.fallback_message_id = event.fallbackMessageId
  }
}
