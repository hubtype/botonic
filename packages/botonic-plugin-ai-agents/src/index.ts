import { BotContext, Plugin } from '@botonic/core'

import { AiAgentClient } from './ai-agent-client'
import { HubtypeClient } from './hubtype-client'
import { AgenticMessage, AiAgentArgs, PluginAiAgentOptions } from './types'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginAiAgents implements Plugin {
  private readonly authToken?: string
  constructor(options?: PluginAiAgentOptions) {
    this.authToken = options?.authToken
  }

  pre(): void {
    return
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AgenticMessage | undefined> {
    const authToken = isProd ? request.session._access_token : this.authToken
    if (!authToken) {
      throw new Error('Auth token is required')
    }

    const hubtypeClient = new HubtypeClient(authToken)
    const aiAgentClient = new AiAgentClient(aiAgentArgs)

    try {
      const messages = isProd
        ? await hubtypeClient.getMessages(request, 10)
        : [{ role: 'user', content: request.input.data } as AgenticMessage]
      const response = await aiAgentClient.runAgent(messages)

      return response
    } catch (error) {
      console.error('error plugin returns undefined', error)
      return undefined
    }
  }
}

export * from './types'
