import type { z } from 'zod'
export interface BaseMessage<
  T extends string =
    | 'text'
    | 'textWithButtons'
    | 'botExecutor'
    | 'carousel'
    | 'exit',
> {
  type: T
}

export interface Button {
  text: string
  payload?: string
  url?: string
  target?: string
}
export interface ButtonWithPayload {
  text: string
  payload: string
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: {
    text: string
  }
}

export interface TextWithButtonsMessage extends BaseMessage {
  type: 'textWithButtons'
  content: {
    text: string
    buttons: Button[]
  }
}

export interface BotExecutorMessage extends BaseMessage {
  type: 'botExecutor'
  content: {
    text: string
    buttons: ButtonWithPayload[]
  }
}

interface CarouselElement {
  title: string
  subtitle: string
  image: string
  button: Button
}

export interface CarouselMessage extends BaseMessage {
  type: 'carousel'
  content: {
    text?: string
    elements: CarouselElement[]
  }
}

export interface ExitMessage extends BaseMessage {
  type: 'exit'
}

export type OutputMessage<Extra extends BaseMessage<string> = never> =
  | TextMessage
  | TextWithButtonsMessage
  | BotExecutorMessage
  | CarouselMessage
  | ExitMessage
  | Extra

export type AgenticOutputMessage<Extra extends BaseMessage<string> = never> =
  Exclude<OutputMessage<Extra>, ExitMessage>

export interface ToolExecution {
  toolName: string
  toolArguments: Record<string, any>
  toolResults?: string
  knowledgebaseSourcesIds?: string[]
  knowledgebaseChunksIds?: string[]
}

export interface RunResult<Extra extends BaseMessage<string> = never> {
  messages: AgenticOutputMessage<Extra>[]
  toolsExecuted: ToolExecution[]
  memoryLength: number
  exit: boolean
  error: boolean
  inputGuardrailsTriggered: string[]
  outputGuardrailsTriggered: string[]
}

export type InferenceResponse<Extra extends BaseMessage<string> = never> =
  RunResult<Extra>

export interface GuardrailRule {
  name: string
  description: string
}
export enum VerbosityLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface AiAgentArgs {
  name: string
  instructions: string
  model: string
  verbosity: VerbosityLevel
  activeTools?: { name: string }[]
  inputGuardrailRules?: GuardrailRule[]
  sourceIds?: string[]
  outputMessagesSchemas?: z.ZodObject<any>[]
}
