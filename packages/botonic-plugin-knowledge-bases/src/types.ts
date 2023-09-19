export interface PluginKnowledgeBaseOptions {
  knowledgeBaseId: string
  host: string
  authToken?: string
  timeout?: number
}

export interface KnowledgeBaseResponse {
  ai: string
  hasKnowledge: boolean
  sources: {
    knowledgeSourceId: string
    page?: number
  }[]
}
