import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { ZodSchema } from 'zod'

export interface PluginAiAgentOptions {
  authToken?: string
  customTools?: CustomTool[]
}

export interface CustomTool {
  name: string
  description: string
  schema: ZodSchema
  returnDirect?: boolean
  func: (input?: any) => Promise<any>
}

export interface AiAgentArgs {
  name: string
  instructions: string
  activeTools?: { name: string }[]
}

export interface OutputBaseMessage {
  type: 'text' | 'textWithButtons' | 'carousel' | 'exit'
}

export interface TextMessage extends OutputBaseMessage {
  type: 'text'
  content: {
    text: string
  }
}

export interface TextWithButtonsMessage extends OutputBaseMessage {
  type: 'textWithButtons'
  content: {
    text: string
    buttons: string[]
  }
}

export interface CarouselMessage extends OutputBaseMessage {
  type: 'carousel'
  content: {
    elements: {
      title: string
      subtitle: string
      image: string
      button: { text: string; url: string }
    }[]
  }
}

export interface ExitMessage extends OutputBaseMessage {
  type: 'exit'
}

export type AgenticInputMessage = HumanMessage | AIMessage
export type AgenticOutputMessage =
  | TextMessage
  | TextWithButtonsMessage
  | CarouselMessage
  | ExitMessage
