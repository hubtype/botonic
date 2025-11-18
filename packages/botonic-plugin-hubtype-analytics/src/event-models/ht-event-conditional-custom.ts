import {
  EventAction,
  EventConditionalCustom,
  EventType,
  RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventConditionalCustom extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  condition_variable: string
  variable_format: string

  constructor(event: EventConditionalCustom, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.ConditionalCountry
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.condition_variable = event.conditionVariable
    this.variable_format = event.variableFormat
  }
}
