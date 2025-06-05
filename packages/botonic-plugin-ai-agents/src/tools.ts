import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const exit_agent = tool(
  async () => {
    return null
  },
  {
    name: 'exit_agent',
    schema: z.object({}),
    description:
      "Finish the interaction with the agent and send the user to the predefined fallback flow.\n\nUse the fallback tool when:\n- You don't know the answer.\n- The user is asking for something that is not related with your context.\n- The user wants to end the conversation.\n- The user wants to handoff the conversation to a real agent.",
    returnDirect: true,
  }
)

export const MANDATORY_TOOLS = [exit_agent]
