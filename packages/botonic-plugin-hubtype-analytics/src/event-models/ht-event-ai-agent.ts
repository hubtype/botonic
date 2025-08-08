/* eslint-disable @typescript-eslint/naming-convention */
import { EventAction, EventAiAgent, EventType, RequestData } from '../types'
import { HtEvent } from './ht-event'

export class HtEventAiAgent extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  tools_executed: string[]
  input_guardrail_triggered: string[]
  output_guardrail_triggered: string[]
  exit: boolean
  error: boolean
  message_id: string

  constructor(event: EventAiAgent, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.AiAgent
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful
    this.tools_executed = event.toolsExecuted
    this.input_guardrail_triggered = event.inputGuardrailTriggered
    this.output_guardrail_triggered = event.outputGuardrailTriggered
    this.exit = event.exit
    this.error = event.error
    this.message_id = event.messageId
  }
}
