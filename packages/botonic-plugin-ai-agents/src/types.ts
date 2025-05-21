/* eslint-disable @typescript-eslint/naming-convention */
export interface AiAgentArgs {
  name: string
  instructions: string
}
export interface Config {
  headers: {
    Authorization: string
    'Content-Type': string
  }
}

export interface AiAgentRequestDataTest {
  messages: {
    role: MessageRole
    content: string
  }[]
  name: string
  instructions: string
}

export type MessageRole = 'user' | 'assistant'

export interface AiAgentRequestData {
  message: string
  memory_length: number
  name: string
  instructions: string
}

export interface AiAgentResponse {
  message: { role: string; content: string }
}
