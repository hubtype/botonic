export interface KnowledgeBaseResponse {
  inferenceId: string
  hasKnowledge: boolean
  isFaithful: boolean
  chunkIds: string[]
  answer: string
}
