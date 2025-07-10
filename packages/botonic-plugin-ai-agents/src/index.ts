import { BotContext, Plugin } from '@botonic/core'
import { tool, FunctionTool } from '@openai/agents'

import { isProd } from './constants'
import { HubtypeApiClient } from './hubtype-api-client'
import { AIAgentRunner } from './runner'
import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AiAgentArgs,
  CustomTool,
  PluginAiAgentOptions,
} from './types'
import { hubtypeTools } from './tools'
import { Context } from './context'

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
      const availableTools = this.customTools.filter(tool =>
        aiAgentArgs.activeTools?.map(tool => tool.name).includes(tool.name)
      )
      const tools = [...this.createTools(availableTools), ...hubtypeTools]

      const runner = new AIAgentRunner(
        aiAgentArgs.name,
        aiAgentArgs.instructions,
        tools
      )
      const context: Context = {
        authToken,
        sources: aiAgentArgs.sourceIds || [],
      }
      const output = await runner.run(messages, context)

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

  private createTools(customTools: CustomTool[]): FunctionTool<Context>[] {
    return customTools.map(customTool => {
      return tool<any, Context, any>({
        name: customTool.name,
        description: customTool.description,
        parameters: customTool.schema,
        execute: customTool.func,
      })
    })
  }
}

export * from './types'
