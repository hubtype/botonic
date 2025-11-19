export interface BaseMessage {
  type: 'text' | 'textWithButtons' | 'carousel' | 'exit'
}

export interface Button {
  text: string
  payload?: string
  url?: string
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

export type OutputMessage =
  | TextMessage
  | TextWithButtonsMessage
  | CarouselMessage
  | ExitMessage

export type AgenticOutputMessage = Exclude<OutputMessage, ExitMessage>

export interface ToolExecution {
  toolName: string
  toolArguments: Record<string, any>
  knowledgebaseSourcesIds?: string[]
  knowledgebaseChunksIds?: string[]
}

export interface RunResult {
  messages: AgenticOutputMessage[]
  toolsExecuted: ToolExecution[]
  memoryLength: number
  exit: boolean
  error: boolean
  inputGuardrailsTriggered: string[]
  outputGuardrailsTriggered: string[]
}

export type InferenceResponse = RunResult

export interface GuardrailRule {
  name: string
  description: string
}
export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
  inputGuardrailRules?: GuardrailRule[]
  sourceIds?: string[]
}
