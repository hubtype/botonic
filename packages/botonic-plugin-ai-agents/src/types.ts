import {
  Agent,
  AgentInputItem,
  RunContext,
  Tool as OpenAITool,
} from '@openai/agents'
import { ZodSchema } from 'zod'

import { OutputMessage, OutputSchema } from './structured-output'
import { BotContext } from '@botonic/core'

export interface Context {
  authToken: string
  request: BotContext
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
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
}

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
