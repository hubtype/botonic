import type { z } from 'zod'

export enum OutputMessageType {
  Text = 'text',
  TextWithButtons = 'textWithButtons',
  BotExecutor = 'botExecutor',
  Carousel = 'carousel',
  Exit = 'exit',
}

export interface BaseMessage<T extends string = OutputMessageType> {
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
  type: OutputMessageType.Text
  content: {
    text: string
  }
}

export interface TextWithButtonsMessage extends BaseMessage {
  type: OutputMessageType.TextWithButtons
  content: {
    text: string
    buttons: Button[]
  }
}

export interface BotExecutorMessage extends BaseMessage {
  type: OutputMessageType.BotExecutor
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
  type: OutputMessageType.Carousel
  content: {
    text?: string
    elements: CarouselElement[]
  }
}

export interface ExitMessage extends BaseMessage {
  type: OutputMessageType.Exit
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

export interface AvailableSpecialist {
  name: string
  description: string
}

export interface RunResult<Extra extends BaseMessage<string> = never> {
  messages: AgenticOutputMessage<Extra>[]
  toolsExecuted: ToolExecution[]
  memoryLength: number
  exit: boolean
  error: boolean
  inputGuardrailsTriggered: string[]
  outputGuardrailsTriggered: string[]
  startingAgentName: string
  lastAgentName: string
  availableSpecialists: AvailableSpecialist[]
  isTransferredToSpecialist: boolean
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

export enum ReasoningEffort {
  None = 'none',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface HubtypeAssistantMessage {
  role: 'assistant'
  content: string
}

export interface HubtypeUserMessage {
  role: 'user'
  content: string
}

export enum AiAgentType {
  Specialist = 'specialist',
  Router = 'router',
}

export type AiAgentArgs = AiAgentSpecialistArgs | AIAgentRouterArgs

export type AiAgentBaseArgs = {
  type: AiAgentType
  name: string
  instructions: string
  model: string
  verbosity: VerbosityLevel
  reasoningEffort?: ReasoningEffort
  disableForceRetrieveKnowledge?: boolean // If true, the agent will not force the retrieve knowledge tool to be used.
  inputGuardrailRules?: GuardrailRule[]
  previousHubtypeMessages?: HubtypeAssistantMessage[]
  outputMessagesSchemas?: z.ZodObject<any>[]
  forceToolNameOverride?: string
}

export interface AiAgentSpecialistArgs extends AiAgentBaseArgs {
  type: AiAgentType.Specialist
  activeTools: { name: string }[]
  sourceIds: string[]
}

interface AIAgentRoute extends AiAgentSpecialistArgs {
  description: string
}

export interface AIAgentRouterArgs extends AiAgentBaseArgs {
  type: AiAgentType.Router
  specialists: AIAgentRoute[]
}
