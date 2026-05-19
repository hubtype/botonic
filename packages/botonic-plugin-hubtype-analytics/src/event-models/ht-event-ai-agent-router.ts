/* eslint-disable @typescript-eslint/naming-convention */
import {
  EventAction,
  type EventAiAgentRouter,
  EventType,
  type HandoffAgent,
  type RequestData,
  type ToolExecution,
} from '../types'
import { HtEvent } from './ht-event'

interface ToolExecutionEventArgs {
  tool_name: string
  tool_arguments: Record<string, unknown>
  tool_results?: string
  knowledgebase_sources_ids?: string[]
  knowledgebase_chunks_ids?: string[]
}

export class HtEventAiAgentRouter extends HtEvent {
  flow_thread_id: string
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
  flow_node_is_meaningful: boolean
  tools_executed: ToolExecutionEventArgs[]
  memory_length: number
  input_message_id: string
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  starting_agent_name: string
  current_agent_name: string
  handoffs: HandoffAgent[]
  is_handoff: boolean

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
    this.tools_executed = event.toolsExecuted.map(tool =>
      this.getToolExecutionInfo(tool)
    )
    this.memory_length = event.memoryLength
    this.input_message_id = event.inputMessageId
    this.input_guardrails_triggered = event.inputGuardrailsTriggered
    this.output_guardrails_triggered = event.outputGuardrailsTriggered
    this.exit = event.exit
    this.starting_agent_name = event.startingAgentName
    this.current_agent_name = event.currentAgentName
    this.handoffs = event.handoffs
    this.is_handoff = event.isHandoff
  }

  private getToolExecutionInfo(
    toolExecution: ToolExecution
  ): ToolExecutionEventArgs {
    const knowledgeBaseArgs: {
      knowledgebase_sources_ids?: string[]
      knowledgebase_chunks_ids?: string[]
    } = {}

    if (toolExecution.knowledgebaseSourcesIds) {
      knowledgeBaseArgs.knowledgebase_sources_ids =
        toolExecution.knowledgebaseSourcesIds
    }

    if (toolExecution.knowledgebaseChunksIds) {
      knowledgeBaseArgs.knowledgebase_chunks_ids =
        toolExecution.knowledgebaseChunksIds
    }

    return {
      tool_name: toolExecution.toolName,
      tool_arguments: toolExecution.toolArguments,
      tool_results: toolExecution.toolResults,
      ...knowledgeBaseArgs,
    }
  }
}
