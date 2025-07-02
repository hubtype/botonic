import { BotContext, Plugin } from '@botonic/core'

import { AiAgentClient } from './ai-agent-client'
import { HubtypeApiClient } from './hubtype-api-client'
import { MANDATORY_TOOLS } from './tools'
import { createCustomTool } from './tools/custom'
import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AiAgentArgs,
  CustomTool,
  PluginAiAgentOptions,
} from './types'
import { AiProvider, loadChatModel } from './utils'

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
  ): Promise<AgenticOutputMessage | undefined> {
    try {
      const authToken = isProd ? request.session._access_token : this.authToken
      if (!authToken) {
        throw new Error('Auth token is required')
      }

      const messages = await this.getMessages(request, authToken, 10)

      const customTools = this.customTools.map(customTool =>
        createCustomTool(customTool)
      )

      const customActiveTools = customTools.filter(tool =>
        aiAgentArgs.activeTools?.map(tool => tool.name).includes(tool.name)
      )
      const tools = [...customActiveTools, ...MANDATORY_TOOLS]

      const chatModel = loadChatModel(AiProvider.AzureOpenAI)
      const aiAgentClient = new AiAgentClient(aiAgentArgs, chatModel, tools)

      return await aiAgentClient.runAgent(messages)
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
    return this.loadLocalMessagesHistory(memoryLength)
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
