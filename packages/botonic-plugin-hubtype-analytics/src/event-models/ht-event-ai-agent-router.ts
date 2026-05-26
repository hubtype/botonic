/* eslint-disable @typescript-eslint/naming-convention */
import {
  type AvailableSpecialist,
  EventAction,
  type EventAiAgentRouter,
  EventType,
  type RequestData,
} from '../types'
import { HtEvent } from './ht-event'

export class HtEventAiAgentRouter extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  memory_length: number
  input_message_id: string
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  error: boolean
  starting_agent_name: string
  last_agent_name: string
  available_specialists: AvailableSpecialist[]
  is_transferred_to_specialist: boolean

  constructor(event: EventAiAgentRouter, requestData: RequestData) {
    super(event, requestData)
    this.type = EventType.BotEvent
    this.action = EventAction.AiAgentRouter
    this.flow_thread_id = event.flowThreadId
    this.flow_id = event.flowId
    this.flow_name = event.flowName
    this.flow_node_id = event.flowNodeId
    this.flow_node_content_id = event.flowNodeContentId
    this.flow_node_is_meaningful = event.flowNodeIsMeaningful
    this.memory_length = event.memoryLength
    this.input_message_id = event.inputMessageId
    this.input_guardrails_triggered = event.inputGuardrailsTriggered
    this.output_guardrails_triggered = event.outputGuardrailsTriggered
    this.exit = event.exit
    this.error = event.error
    this.starting_agent_name = event.startingAgentName
    this.last_agent_name = event.lastAgentName
    this.available_specialists = event.availableSpecialists
    this.is_transferred_to_specialist = event.isTransferredToSpecialist
  }
}
