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

export interface AgenticMessage {
  role: 'assistant' | 'user'
  content: string
}
