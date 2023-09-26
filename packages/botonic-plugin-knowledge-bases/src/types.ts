export interface PluginKnowledgeBaseOptions {
  knowledgeBaseId: string
  host: string
  authToken?: string
  timeout?: number
}

export interface KnowledgeBaseResponse {
  answer: string
  hasKnowledge: boolean
  sources: {
    knowledgeSourceId: string
    page?: number
  }[]
}
