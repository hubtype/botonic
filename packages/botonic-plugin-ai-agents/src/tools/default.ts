import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const handoffToHumanAgent = tool(
  async () => {
    return null
  },
  {
    name: 'handoffToHumanAgent',
    schema: z.object({}),
    description:
      'Use this tool strictly when the user wants to talk with a human agent.',
    returnDirect: true,
  }
)

export const outOfContext = tool(
  async () => {
    return null
  },
  {
    name: 'outOfContext',
    schema: z.object({}),
    description:
      'Use this when the user talks about something that is clearly out of your context. Example: "I want to buy a car" when you are a travel agent.',
    returnDirect: true,
  }
)

export const finishConversation = tool(
  async () => {
    return null
  },
  {
    name: 'finishConversation',
    schema: z.object({}),
    description: 'Use this when the user wants to end the conversation.',
    returnDirect: true,
  }
)

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

export const MANDATORY_TOOLS = [
  handoffToHumanAgent,
  outOfContext,
  finishConversation,
  generateMessageWithButtons,
  generateCarouselMessage,
]

export const EXIT_TOOLS = [
  handoffToHumanAgent.name,
  outOfContext.name,
  finishConversation.name,
]
