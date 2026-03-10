import type { EventAction } from '@botonic/core'
import type { ChunkIdsGroupedBySourceData } from '../knowledge-bases-types'

export interface ToolExecuted {
  tool_name: string
  tool_arguments: Record<string, unknown>
  tool_results?: string
  knowledgebase_sources_ids?: string[]
  knowledgebase_chunks_ids?: string[]
}

export interface AiAgentDebugEvent {
  action: EventAction.AiAgent
  flow_node_content_id: string
  user_input?: string
  tools_executed: ToolExecuted[]
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  error: boolean
  knowledge_base_chunks_with_sources?: ChunkIdsGroupedBySourceData[]
  messageId?: string
}
