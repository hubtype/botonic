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
  sourceIds: string[]
  knowledgeUsed: {
    query: string
    sourceIds: string[]
    chunksIds: string[]
    chunkTexts: string[]
  }
  request: BotContext<TPlugins, TExtraData>
}

export type RunContext<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = OpenAIRunContext<Context<TPlugins, TExtraData>>

export interface CustomTool<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  name: string
  description: string
  schema: ZodSchema
  func: (
    input?: any,
    runContext?: RunContext<TPlugins, TExtraData>
  ) => Promise<any>
}

export interface Chunk {
  id: string
  text: string
}

export type ContactInfo = Record<string, string>

export type Tool<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = OpenAITool<Context<TPlugins, TExtraData>>
export type AIAgent<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> = Agent<Context<TPlugins, TExtraData>, typeof OutputSchema>
export interface PluginAiAgentOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  authToken?: string
  customTools?: CustomTool<TPlugins, TExtraData>[]
  maxRetries?: number
  timeout?: number
}

export type AgenticInputMessage = AgentInputItem

export {
  AgenticOutputMessage,
  AiAgentArgs,
  GuardrailRule,
  InferenceResponse,
  RunResult,
}
