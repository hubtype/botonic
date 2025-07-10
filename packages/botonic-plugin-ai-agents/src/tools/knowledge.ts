import { RunContext, tool } from '@openai/agents'
import { z } from 'zod'
import { Context } from '../context'
import { HubtypeApiClient } from '../hubtype-api-client'

export const consultKnowledgeBase = tool<any, Context, any>({
  name: 'consultKnowledgeBase',
  description: 'Consult the knowledge base for information',
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
    const sources = context.sources
    const client = new HubtypeApiClient(context.authToken)
    const chunks = await client.retrieveSimilarChunks(query, sources)
    return chunks
  },
})
