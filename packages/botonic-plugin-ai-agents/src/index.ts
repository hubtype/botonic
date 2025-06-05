import { BotContext, Plugin } from '@botonic/core'

import { AiAgentClient } from './ai-agent-client'
import { HubtypeClient } from './hubtype-client'
import { AgenticMessage, AiAgentArgs } from './types'

export default class BotonicPluginAiAgents implements Plugin {
  pre(): void {
    return
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AgenticMessage> {
    const { name, instructions } = aiAgentArgs
    const hubtypeClient = new HubtypeClient()
    const messages = await hubtypeClient.getMessages(request, 3)

    const aiAgentClient = new AiAgentClient(name, instructions)
    const response = await aiAgentClient.run(messages)
    console.log('response', response)

    return {
      role: 'assistant',
      content: response || '',
    }
  }
}
