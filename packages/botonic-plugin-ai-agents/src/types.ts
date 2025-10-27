import {
  AgenticOutputMessage,
  AiAgentArgs,
  GuardrailRule,
  InferenceResponse,
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

export interface Context {
  authToken: string
  sourceIds: string[]
  knowledgeUsed: {
    query: string
    sourceIds: string[]
    chunksIds: string[]
    chunkTexts: string[]
  }
}

export type RunContext = OpenAIRunContext<Context>

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
  func: (input?: any, runContext?: RunContext) => Promise<any>
}

export interface Chunk {
  id: string
  text: string
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
