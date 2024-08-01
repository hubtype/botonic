interface MockKnowledgeBaseOptions {
  userInput: string
  answer: string
  hasKnowledge: boolean
  isFaithuful: boolean
}

export function mockKnowledgeBaseResponse({
  userInput,
  answer,
  hasKnowledge,
  isFaithuful,
}: MockKnowledgeBaseOptions) {
  return jest.fn(() => {
    return Promise.resolve({
      inferenceId: 'inferenceId',
      question: userInput,
      answer,
      hasKnowledge,
      isFaithuful,
      chunkIds: ['sourceChunkId1', 'sourceChunkId2'],
    })
  })
}
