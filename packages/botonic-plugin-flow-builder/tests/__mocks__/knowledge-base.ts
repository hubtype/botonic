import { KnowledgeBasesResponse } from '@botonic/core'

interface MockKnowledgeBaseOptions {
  answer: string
  hasKnowledge: boolean
  isFaithful: boolean
}

export function mockKnowledgeBaseResponse({
  answer,
  hasKnowledge,
  isFaithful,
}: MockKnowledgeBaseOptions): jest.Mock<Promise<KnowledgeBasesResponse>> {
  return jest.fn(() => {
    return Promise.resolve({
      inferenceId: 'inferenceId',
      answer,
      hasKnowledge,
      isFaithful,
      chunkIds: ['sourceChunkId1', 'sourceChunkId2'],
    })
  })
}
