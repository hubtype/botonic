import { AiAgentDebugEvent } from './events/ai-agent'
import { FallbackDebugEvent } from './events/fallback'
import { KeywordDebugEvent } from './events/keyword'
import { KnowledgeBaseDebugEvent } from './events/knowledge-base'

// Union type of all debug event types
export type DebugEvent =
  | KeywordDebugEvent
  | AiAgentDebugEvent
  | KnowledgeBaseDebugEvent
  | FallbackDebugEvent
