import {
  EventAction,
  EventConditionalChannel,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventConditionalChannel extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  channel: string

  constructor(event: EventConditionalChannel, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.ConditionalChannel
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.channel = event.channel
  }
}
