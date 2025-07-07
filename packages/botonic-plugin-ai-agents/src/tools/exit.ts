import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const outOfContext = tool(
  async () => {
    console.log('Tool: finishConversation')
    return null
  },
  {
    name: 'outOfContext',
    description:
      'Use this to exit the conversation because the user is asking for something that is not context-related.',
    schema: z.object({}),
  }
)

export const finishConversation = tool(
  async () => {
    console.log('Tool: finishConversation')
    return null
  },
  {
    name: 'finishConversation',
    description: 'Use this to finish the conversation.',
    schema: z.object({}),
  }
)

export const EXIT_TOOLS = [outOfContext, finishConversation]
