/* eslint-disable @typescript-eslint/naming-convention */
export interface AiAgentArgs {
  name: string
  instructions: string
}
export interface Config {
  headers: {
    Authorization: string
    'Content-Type': string
  }
}

export interface AiAgentRequestDataTest {
  messages: {
    role: MessageRole
    content: string
  }[]
  name: string
  instructions: string
}

export type MessageRole = 'user' | 'assistant' | 'tool'

export interface AiAgentRequestData {
  message: string
  memory_length: number
  name: string
  instructions: string
}

export interface AiAgentResponse {
  message: AgentMessage
}

export interface AssistantMessage {
  role: 'assistant'
  content: string
}

export interface UserMessage {
  role: 'user'
  content: string
}

export interface ToolMessage {
  role: 'tool'
  tool_name: string
  tool_params?: Record<string, unknown>
}

export type AgentMessage = AssistantMessage | ToolMessage
