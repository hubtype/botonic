import { KnowledgeBaseResponse } from '@botonic/core'

interface MockKnowledgeBaseOptions {
  answer: string
  hasKnowledge: boolean
  isFaithful: boolean
}

export function mockKnowledgeBaseResponse({
  answer,
  hasKnowledge,
  isFaithful,
}: MockKnowledgeBaseOptions): jest.Mock<Promise<KnowledgeBaseResponse>> {
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
