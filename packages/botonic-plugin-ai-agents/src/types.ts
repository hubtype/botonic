import {
  Agent,
  AgentInputItem,
  RunContext as OpenAIRunContext,
  Tool as OpenAITool,
} from '@openai/agents'
import { ZodSchema } from 'zod'

import { OutputMessage, OutputSchema } from './structured-output'
import { ExitMessage } from './structured-output/exit'

export interface Context {
  authToken: string
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
export type AgenticOutputMessage = Exclude<OutputMessage, ExitMessage>

export interface RunResult {
  messages: AgenticOutputMessage[]
  toolsExecuted: string[]
  exit: boolean
  inputGuardrailTriggered: boolean
  outputGuardrailTriggered: boolean
}

export type InferenceResponse = RunResult | undefined
