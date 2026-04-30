import { createRetrieveKnowledge } from '../src/tools/retrieve-knowledge'
import type { Context } from '../src/types'

const mockRetrieveSimilarChunks = jest.fn()

type RetrieveKnowledgeTool = {
  execute: (
    input: { query: string },
    runContext: { context: Context }
  ) => Promise<string[]>
}

jest.mock('@openai/agents', () => ({
  tool: jest.fn(config => config),
}))

jest.mock('../src/services/hubtype-api-client', () => ({
  HubtypeApiClient: jest.fn().mockImplementation(() => ({
    retrieveSimilarChunks: mockRetrieveSimilarChunks,
  })),
}))

const buildContext = (): Context =>
  ({
    authToken: 'test-token',
    knowledgeUsed: {
      query: '',
      sourceIds: [],
      chunksIds: [],
      chunkTexts: [],
    },
    request: {},
  }) as unknown as Context

describe('createRetrieveKnowledge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRetrieveSimilarChunks.mockResolvedValue([
      { id: 'chunk-1', text: 'Knowledge chunk' },
    ] as never)
  })

  it('uses configured sourceIds when runtime context has none', async () => {
    const retrieveKnowledge = createRetrieveKnowledge([
      'source-1',
    ]) as unknown as RetrieveKnowledgeTool
    const context = buildContext()

    const result = await retrieveKnowledge.execute(
      { query: 'shipping policy' },
      { context }
    )

    expect(mockRetrieveSimilarChunks).toHaveBeenCalledWith('shipping policy', [
      'source-1',
    ])
    expect(context.knowledgeUsed).toEqual({
      query: 'shipping policy',
      sourceIds: ['source-1'],
      chunksIds: ['chunk-1'],
      chunkTexts: ['Knowledge chunk'],
    })
    expect(result).toEqual(['Knowledge chunk'])
  })
})
