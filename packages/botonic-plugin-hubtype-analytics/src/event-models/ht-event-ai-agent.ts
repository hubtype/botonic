/* eslint-disable @typescript-eslint/naming-convention */
import {
  EventAction,
  EventAiAgent,
  EventType,
  RequestData,
  ToolExecution,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventAiAgent extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  tools_executed: ToolExecution[]
  memory_length: number
  input_message_id: string
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  error: boolean

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
    this.memory_length = event.memoryLength
    this.input_message_id = event.inputMessageId
    this.input_guardrails_triggered = event.inputGuardrailsTriggered
    this.output_guardrails_triggered = event.outputGuardrailsTriggered
    this.exit = event.exit
    this.error = event.error
  }
}
