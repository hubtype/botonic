import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const generateMessageWithButtons = tool(
  async (input: { text: string; options: string[] }) => {
    console.log('generateMessageWithButtons', input)
    return {
      text: input.text,
      buttons: input.options.map(option => ({
        text: option,
        payload: 'do-nothing',
      })),
    }
  },
  {
    name: 'generateMessageWithButtons',
    schema: z.object({
      text: z.string(),
      options: z.array(z.string()),
    }),
    description: 'Generate a message with a list of buttons to choose from.',
    returnDirect: true,
  }
)

export const generateCarouselMessage = tool(
  async (input: {
    elements: {
      title: string
      subtitle: string
      image: string
      button: {
        text: string
        url: string
      }
    }[]
  }) => {
    console.log('Generating carousel message with input: ', input)
    return {
      elements: input.elements,
    }
  },
  {
    name: 'generateCarouselMessage',
    schema: z.object({
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
    description:
      'Use this tool to generate and send a carousel message to the user.',
    returnDirect: true,
  }
)

export const MESSAGE_TOOLS = [
  generateMessageWithButtons,
  generateCarouselMessage,
]
