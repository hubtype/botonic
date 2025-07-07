import { BotContext, Plugin } from '@botonic/core'

import { HubtypeApiClient } from './hubtype-api-client'
import { AIAgentRunner } from './runner'
import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AiAgentArgs,
  CustomTool,
  PluginAiAgentOptions,
} from './types'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginAiAgents implements Plugin {
  private readonly authToken?: string
  public customTools: CustomTool[] = []

  constructor(options?: PluginAiAgentOptions) {
    this.authToken = options?.authToken
    this.customTools = options?.customTools || []
  }

  pre(): void {
    return
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AgenticOutputMessage[] | undefined> {
    try {
      const authToken = isProd ? request.session._access_token : this.authToken
      if (!authToken) {
        throw new Error('Auth token is required')
      }

      const messages = await this.getMessages(request, authToken, 10)

      const runner = new AIAgentRunner(
        aiAgentArgs.name,
        aiAgentArgs.instructions,
        []
      )
      const output = await runner.run(messages)
      console.log('\n\nOutput:', output)

      return output
    } catch (error) {
      console.error('error plugin returns undefined', error)
      return undefined
    }
  }

  private async getMessages(
    request: BotContext,
    authToken: string,
    memoryLength: number
  ): Promise<AgenticInputMessage[]> {
    if (isProd) {
      const hubtypeClient = new HubtypeApiClient(authToken)
      return await hubtypeClient.getMessages(request, memoryLength)
    }
    const hubtypeClient = new HubtypeApiClient(authToken)
    return await hubtypeClient.getLocalMessages(memoryLength)
  }

  private loadLocalMessagesHistory(
    memoryLength: number
  ): AgenticInputMessage[] {
    const localBotonicState = localStorage.getItem('botonicState')
    const botonicState = JSON.parse(localBotonicState || '{}')
    const messages = botonicState.messages
    const filteredMessages = messages
      .filter(message => message.data.text)
      .map(message => ({
        role: message.sentBy === 'user' ? 'user' : 'assistant',
        content: message.data.text,
      }))
    return filteredMessages.slice(-memoryLength)
  }
}

export * from './types'
