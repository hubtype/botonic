export interface BaseMessage {
  type: 'text' | 'textWithButtons' | 'carousel' | 'exit'
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
    buttons: string[]
  }
}

interface CarouselElement {
  title: string
  subtitle: string
  image: string
  button: { text: string; url: string }
}

export interface CarouselMessage extends BaseMessage {
  type: 'carousel'
  content: {
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

export interface RunResult {
  messages: AgenticOutputMessage[]
  toolsExecuted: string[]
  exit: boolean
  error: boolean
  inputGuardrailTriggered: string[]
  outputGuardrailTriggered: string[]
}

export type InferenceResponse = RunResult
