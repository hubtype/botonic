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

export const MANDATORY_TOOLS = [
  handoffToHumanAgent,
  outOfContext,
  finishConversation,
]

export const EXIT_TOOLS = [
  handoffToHumanAgent.name,
  outOfContext.name,
  finishConversation.name,
]
