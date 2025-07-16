import {
  Agent,
  AgentInputItem,
  RunContext,
  Tool as OpenAITool,
} from '@openai/agents'
import { ZodObject } from 'zod'

import { OutputMessage, OutputSchema } from './structured-output'

export interface Context {
  authToken: string
  sources: string[]
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodObject<any>
  func: (input?: any, runContext?: RunContext<Context>) => Promise<any>
}

export type Tool = OpenAITool<Context>
export type AIAgent = Agent<Context, typeof OutputSchema>

export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
  sourceIds?: string[]
}

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
