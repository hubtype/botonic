export interface PluginKnowledgeBaseOptions {
  knowledgeBaseId: string
  host: string
  authToken?: string
  timeout?: number
}

export interface KnowledgeBaseResponse {
  question: string
  answer: string
  hasKnowledge: boolean
  sources: {
    knowledgeSourceId: string
    page?: number
  }[]
}
