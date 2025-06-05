export interface PluginAiAgentOptions {
  authToken?: string
}
export interface AiAgentArgs {
  name: string
  instructions: string
}

export interface AgenticMessage {
  role: 'assistant' | 'user'
  content: string
}
