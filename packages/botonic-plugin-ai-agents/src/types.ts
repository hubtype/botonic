import { ZodSchema } from 'zod'
export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
  returnDirect?: boolean
  func: (input?: any) => Promise<any>
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
}

export interface AgenticBaseMessage {
  role: 'assistant' | 'user' | 'tool' | 'exit'
}

export interface AssistantMessage extends AgenticBaseMessage {
  role: 'assistant'
  content: string
}

export interface UserMessage extends AgenticBaseMessage {
  role: 'user'
  content: string
}

export interface ToolMessage extends AgenticBaseMessage {
  role: 'tool'
  toolName: string
  toolOutput: string | null
}

export interface ExitMessage extends AgenticBaseMessage {
  role: 'exit'
}

export type AgenticInputMessage = AssistantMessage | UserMessage
export type AgenticOutputMessage = AssistantMessage | ToolMessage | ExitMessage
export type AgenticMessage =
  | AssistantMessage
  | UserMessage
  | ToolMessage
  | ExitMessage
