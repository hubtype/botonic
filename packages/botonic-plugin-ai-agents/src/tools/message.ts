import { tool } from '@langchain/core/tools'
import { z } from 'zod'

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
          z.object({
            type: z.enum(['carousel']),
            content: z.object({
              elements: z.array(
                z.object({
                  title: z.string(),
                  subtitle: z.string(),
                  image: z.string(),
                  button: z.object({
                    text: z.string(),
                    url: z.string(),
                  }),
                })
              ),
            }),
          }),
        ])
      ),
    }),
  }
)
