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
      sources: [
        {
          knowledgeBaseId: 'knowledgeBaseId',
          knowledgeSourceId: 'knowledgeSourceId',
          knowledgeChunkId: 'knowledgeChunkId',
        },
      ],
    })
  })
}
