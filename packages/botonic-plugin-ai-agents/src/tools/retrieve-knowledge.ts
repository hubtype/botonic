import { type RunContext, tool } from '@openai/agents'
import { z } from 'zod'

import { HubtypeApiClient } from '../services/hubtype-api-client'
import type { Context } from '../types'

export const RETRIEVE_KNOWLEDGE_TOOL_NAME = 'retrieve_knowledge'

export const createRetrieveKnowledge = (sourceIds: string[]) =>
  tool({
    name: RETRIEVE_KNOWLEDGE_TOOL_NAME,
    description:
      'Consult the knowledge base for information before answering. Use this tool to make sure the information you provide is faithful.',
    parameters: z.object({
      query: z.string().describe('The query to search the knowledge base for'),
    }),
    execute: async (
      input: { query: string },
      runContext?: RunContext<Context>
    ): Promise<string[]> => {
      const context = runContext?.context
      const query = input.query
      if (!context) {
        throw new Error('Context is required')
      }
      const client = new HubtypeApiClient(context.authToken)
      const chunks = await client.retrieveSimilarChunks(query, sourceIds)
      const chunksIds = chunks.map(chunk => chunk.id)
      const chunkTexts = chunks.map(chunk => chunk.text)

      context.knowledgeUsed = {
        query,
        sourceIds,
        chunksIds,
        chunkTexts,
      }

      return chunkTexts
    },
  })
