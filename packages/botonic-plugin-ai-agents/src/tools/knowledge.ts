import { RunContext, tool } from '@openai/agents'
import { z } from 'zod'
import { Context } from '../context'

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
    const sources = runContext?.context.sources
    console.log(`Query ${query} executed on sources: ${sources}`)
    return [
      'El check-in es a las 14:00',
      'El check-out es a las 12:00',
      'No se devuelve la fianza si se rompe algo',
    ]
  },
})
