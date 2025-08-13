export interface KnowledgeBasesResponse {
  inferenceId: string
  hasKnowledge: boolean
  isFaithful: boolean
  chunkIds: string[]
  answer: string
}
