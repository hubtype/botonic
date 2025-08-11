import { BotContext, Plugin } from '@botonic/core'
import { tool } from '@openai/agents'

import { AIAgentBuilder } from './agent-builder'
import { isProd } from './constants'
import { HubtypeApiClient } from './hubtype-api-client'
import { setUpOpenAI } from './openai'
import { AIAgentRunner } from './runner'
import {
  AgenticInputMessage,
  AiAgentArgs,
  Context,
  CustomTool,
  InferenceResponse,
  PluginAiAgentOptions,
  Tool,
} from './types'

export default class BotonicPluginAiAgents implements Plugin {
  private readonly authToken?: string
  public toolDefinitions: CustomTool[] = []

  constructor(options?: PluginAiAgentOptions) {
    setUpOpenAI()
    this.authToken = options?.authToken
    this.toolDefinitions = options?.customTools || []
  }

  pre(): void {
    return
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<InferenceResponse> {
    try {
      const authToken = isProd ? request.session._access_token : this.authToken
      if (!authToken) {
        throw new Error('Auth token is required')
      }

      const tools = this.buildTools(
        aiAgentArgs.activeTools?.map(tool => tool.name) || []
      )
      const agent = new AIAgentBuilder(
        aiAgentArgs.name,
        aiAgentArgs.instructions,
        tools,
        request.session.user.contact_info || {}
      ).build()

      const messages = await this.getMessages(request, authToken, 25)
      const context: Context = {
        authToken,
      }

      const runner = new AIAgentRunner(agent)
      return await runner.run(messages, context)
    } catch (error) {
      console.error('error plugin returns undefined', error)
      // Here we can return a InferenceResponse as a exit
      // but indicate that the inference failed
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

  private buildTools(activeToolNames: string[]): Tool[] {
    const availableTools = this.toolDefinitions.filter(tool =>
      activeToolNames.includes(tool.name)
    )
    return availableTools.map(toolDefinition => {
      return tool<any, Context, any>({
        name: toolDefinition.name,
        description: toolDefinition.description,
        parameters: toolDefinition.schema,
        execute: toolDefinition.func,
      })
    })
  }
}

export * from './types'
