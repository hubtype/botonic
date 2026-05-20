import type { EventAction } from '@botonic/core'
import type { ToolExecuted } from '../ai-agent/types'
import type { ChunkIdsGroupedBySourceData } from '../knowledge-bases-types'

export type { ToolExecuted }

export interface HandoffAgentDebugEvent {
  name: string
  description: string
}

export interface AiAgentRouterDebugEvent {
  action: EventAction.AiAgentRouter
  flow_node_content_id: string
  tools_executed: ToolExecuted[]
  memory_length: number
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  starting_agent_name: string
  last_agent_name: string
  available_handoffs: HandoffAgentDebugEvent[]
  is_handoff: boolean
  knowledge_base_chunks_with_sources?: ChunkIdsGroupedBySourceData[]
  messageId?: string
}
