import {
  AgenticOutputMessage,
  AiAgentArgs,
  BotContext,
  GuardrailRule,
  InferenceResponse,
  ResolvedPlugins,
  RunResult,
} from '@botonic/core'
import {
  Agent,
  AgentInputItem,
  RunContext as OpenAIRunContext,
  Tool as OpenAITool,
} from '@openai/agents'
import { ZodSchema } from 'zod'

import { OutputSchema } from './structured-output'

export interface Context<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  authToken: string
  request: BotContext<TPlugins, TExtraData>
  sources: string[]
}

export type RunContext<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = OpenAIRunContext<Context<TPlugins, TExtraData>>

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
  func: <TPlugins extends ResolvedPlugins = ResolvedPlugins, TExtraData = any>(
    input?: any,
    runContext?: RunContext<TPlugins, TExtraData>
  ) => Promise<any>
}

export type ContactInfo = Record<string, string>

export type Tool = OpenAITool<Context>
export type AIAgent = Agent<Context, typeof OutputSchema>
export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export type AgenticInputMessage = AgentInputItem

export {
  AgenticOutputMessage,
  AiAgentArgs,
  GuardrailRule,
  InferenceResponse,
  RunResult,
}
