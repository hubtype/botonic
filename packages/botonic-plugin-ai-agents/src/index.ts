import { BotContext, Plugin } from '@botonic/core'

import { AiAgentClient } from './ai-agent-client'
import { HubtypeApiClient } from './hubtype-api-client'
import { createCustomTool } from './tools/custom'
import { MANDATORY_TOOLS } from './tools/default'
import {
  AgenticOutputMessage,
  AiAgentArgs,
  CustomTool,
  PluginAiAgentOptions,
  UserMessage,
} from './types'
import { loadChatModel } from './utils'

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

      const hubtypeClient = new HubtypeApiClient(authToken)
      const messages = isProd
        ? await hubtypeClient.getMessages(request, 10)
        : [{ role: 'user', content: request.input.data } as UserMessage]

      const customTools = this.customTools.map(customTool =>
        createCustomTool(customTool)
      )

      const tools = [...customTools, ...MANDATORY_TOOLS]
      const chatModel = loadChatModel('azureOpenAI')
      const aiAgentClient = new AiAgentClient(aiAgentArgs, chatModel, tools)

      return await aiAgentClient.runAgent(messages)
    } catch (error) {
      console.error('error plugin returns undefined', error)
      return undefined
    }
  }
}

export * from './types'
