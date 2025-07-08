import { AgentInputItem } from '@openai/agents'
import { ZodObject } from 'zod'

import { OutputMessage } from './structured-output'
export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodObject<any>
  func: (input?: any) => Promise<any>
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
}

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
