export interface PluginKnowledgeBaseOptions {
  host: string
  authToken?: string
  timeout?: number
}

export interface KnowledgeBaseResponse {
  inferenceId: string
  question: string
  answer: string
  hasKnowledge: boolean
  isFaithuful: boolean
  chunkIds: string[]
}
