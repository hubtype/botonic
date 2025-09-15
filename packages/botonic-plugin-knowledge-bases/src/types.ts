import { KnowledgeBasesResponse } from '@botonic/core'

export interface PluginKnowledgeBaseOptions {
  host: string
  authToken?: string
  timeout?: number
  verbose?: boolean
}

export type { KnowledgeBasesResponse }

export interface Chunk {
  id: string
  text: string
}
