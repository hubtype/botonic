import { KnowledgeBaseResponse } from '@botonic/core'

export interface PluginKnowledgeBaseOptions {
  host: string
  authToken?: string
  timeout?: number
}

export type { KnowledgeBaseResponse }

export interface Chunk {
  id: string
  text: string
}
