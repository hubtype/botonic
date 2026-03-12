import type { AgenticInputMessage } from '../types'

export interface LlmRunData {
  inference_id: string
  is_test: boolean
  deployment_name: string
  model_name: string
  feature: string
  api_version: string
  num_prompt_tokens: number
  num_completion_tokens: number
  duration_in_milliseconds: number
  temperature: number
  error: string | null
}

export interface BotTrackLlmRunsData {
  llm_runs: LlmRunData[]
}

interface HubtypeAssistantMessage {
  role: 'assistant'
  content: string
}

interface HubtypeUserMessage {
  role: 'user'
  content: string
}

export type HubtypeMessage = HubtypeAssistantMessage | HubtypeUserMessage

// V2 API Types
interface HubtypeToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

interface HubtypeUserMessageV2 {
  role: 'user'
  content: string | null
}

export interface HubtypeAssistantMessageV2 {
  role: 'assistant'
  content: string | null
  tool_calls?: HubtypeToolCall[] | null
}

export interface HubtypeToolMessageV2 {
  role: 'tool'
  content: string | null
  tool_call_id: string
}

interface HubtypeSystemMessageV2 {
  role: 'system'
  content: string | null
}

export type HubtypeMessageV2 =
  | HubtypeUserMessageV2
  | HubtypeAssistantMessageV2
  | HubtypeToolMessageV2
  | HubtypeSystemMessageV2

export interface MessageHistoryResponseV2 {
  messages: HubtypeMessageV2[]
  conversation_id: string | null
  truncated: boolean
}

export interface GetMessagesV2Options {
  maxMessages?: number
  includeToolCalls?: boolean
  maxFullToolResults?: number
  debugMode?: boolean
}

export interface GetMessagesV2Result {
  messages: AgenticInputMessage[]
  conversationId: string | null
  truncated: boolean
}

export interface MessageHistoryV2Params {
  last_message_id: string
  max_messages?: number
  include_tool_calls?: boolean
  max_full_tool_results?: number
  debug_mode?: boolean
}
