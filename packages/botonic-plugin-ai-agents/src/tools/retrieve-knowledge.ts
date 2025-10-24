import { RunContext, tool } from '@openai/agents'
import { z } from 'zod'

import { Chunk, HubtypeApiClient } from '../hubtype-api-client'
import { Context } from '../types'

export const retrieveKnowledge = tool<any, Context, any>({
  name: 'retrieve_knowledge',
  description:
    'Consult the knowledge base for information before answering. Use this tool to make sure the information you provide is faithful.',
  parameters: z.object({
    query: z.string().describe('The query to search the knowledge base for'),
  }),
  execute: async (
    { query }: { query: string },
    runContext?: RunContext<Context>
  ): Promise<string[]> => {
    const context = runContext?.context
    if (!context) {
      throw new Error('Context is required')
    }
    const sourceIds = context.sources
    const client = new HubtypeApiClient(context.authToken)
    const chunks = await client.retrieveSimilarChunks(query, sourceIds)

    context.knowledgeUsed = {
      query,
      sourceIds,
      chunksIds: chunks.map((chunk: Chunk) => chunk.id),
      chunkTexts: chunks.map((chunk: Chunk) => chunk.text),
    }

    return chunks.map(chunk => chunk.text)
  },
})
