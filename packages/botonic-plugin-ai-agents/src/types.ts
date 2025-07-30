import {
  Agent,
  AgentInputItem,
  Tool as OpenAITool,
  RunContext as OpenAIRunContext,
} from '@openai/agents'
import { ZodSchema } from 'zod'

import { BotContext } from '@botonic/core'
import { OutputMessage, OutputSchema } from './structured-output'

export interface Context {
  authToken: string
  request: BotContext
}

export type RunContext = OpenAIRunContext<Context>

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
  func: (input?: any, runContext?: RunContext) => Promise<any>
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
}

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
