import type { EventUpdateVariables } from '@botonic/core'

import { EventAction, EventType, type RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventUpdateVariables extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  set_variables: Record<string, string | number | boolean>
  unset_variables: string[]

  constructor(event: EventUpdateVariables, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.UpdateVariables
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful
    this.set_variables = event.setVariables
    this.unset_variables = event.unsetVariables
  }
}
