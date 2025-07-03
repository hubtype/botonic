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

export const messageResponse = tool(
  async (input: { messages: any[] }) => {
    console.log('Tool: messageResponse', input)
    return input
  },
  {
    name: 'messageResponse',
    description: 'Use this to respond to the user.',
    schema: z.object({
      messages: z.array(
        z.union([
          z.object({
            type: z.enum(['text']),
            content: z.object({ text: z.string() }),
          }),
          z.object({
            type: z.enum(['textWithButtons']),
            content: z.object({
              text: z.string(),
              buttons: z.array(z.string()),
            }),
          }),
        ])
      ),
    }),
  }
)

export const MANDATORY_TOOLS = [
  outOfContext,
  finishConversation,
  messageResponse,
]
