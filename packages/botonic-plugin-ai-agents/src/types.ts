import { AgentInputItem, RunContext } from '@openai/agents'
import { ZodObject } from 'zod'

import { OutputMessage } from './structured-output'
import { Context } from './context'

export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodObject<any>
  func: (input?: any, runContext?: RunContext<Context>) => Promise<any>
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
}

export type AgenticInputMessage = AgentInputItem
export type AgenticOutputMessage = OutputMessage
