interface MockKnowledgeBaseOptions {
  userInput: string
  answer: string
  hasKnowledge: boolean
  isFaithful: boolean
}

export function mockKnowledgeBaseResponse({
  userInput,
  answer,
  hasKnowledge,
  isFaithful,
}: MockKnowledgeBaseOptions) {
  return jest.fn(() => {
    return Promise.resolve({
      inferenceId: 'inferenceId',
      question: userInput,
      answer,
      hasKnowledge,
      isFaithful,
      chunkIds: ['sourceChunkId1', 'sourceChunkId2'],
    })
  })
}
