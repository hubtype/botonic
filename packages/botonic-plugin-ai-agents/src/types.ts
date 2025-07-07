import { ZodSchema } from 'zod'
import { AgentInputItem } from '@openai/agents'
import { OutputMessage } from './structured-output'
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

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
