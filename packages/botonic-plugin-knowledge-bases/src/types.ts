export interface PluginKnowledgeBaseOptions {
  host: string
  authToken?: string
  timeout?: number
}

export interface KnowledgeBaseResponse {
  inferenceId: string
  hasKnowledge: boolean
  isFaithful: boolean
  chunkIds: string[]
  answer: string
}

export interface Chunk {
  id: string
  text: string
}
