import { AiAgentArgs, BotContext, Plugin, ResolvedPlugins } from '@botonic/core'
import { tool } from '@openai/agents'

import { AIAgentBuilder } from './agent-builder'
import { isProd, MAX_MEMORY_LENGTH } from './constants'
import { HubtypeApiClient } from './hubtype-api-client'
import { setUpOpenAI } from './openai'
import { AIAgentRunner } from './runner'
import {
  AgenticInputMessage,
  Context,
  CustomTool,
  InferenceResponse,
  PluginAiAgentOptions,
  Tool,
} from './types'

export default class BotonicPluginAiAgents<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> implements Plugin
{
  private readonly authToken?: string
  public toolDefinitions: CustomTool<TPlugins, TExtraData>[] = []

  constructor(options?: PluginAiAgentOptions<TPlugins, TExtraData>) {
    setUpOpenAI(options?.maxRetries, options?.timeout)
    this.authToken = options?.authToken
    this.toolDefinitions = options?.customTools || []
  }

  pre(): void {
    return
  }

  async getInference(
    request: BotContext<TPlugins, TExtraData>,
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
      const agent = new AIAgentBuilder<TPlugins, TExtraData>(
        aiAgentArgs.name,
        aiAgentArgs.instructions,
        tools,
        request.session.user.contact_info || {},
        aiAgentArgs.inputGuardrailRules || [],
        aiAgentArgs.sourceIds || []
      ).build()

      const messages = await this.getMessages(
        request,
        authToken,
        MAX_MEMORY_LENGTH
      )
      const context: Context<TPlugins, TExtraData> = {
        authToken,
        sourceIds: aiAgentArgs.sourceIds || [],
        knowledgeUsed: {
          query: '',
          sourceIds: [],
          chunksIds: [],
          chunkTexts: [],
        },
        request,
      }

      const runner = new AIAgentRunner<TPlugins, TExtraData>(agent)
      return await runner.run(messages, context)
    } catch (error) {
      console.error('error plugin returns undefined', error)
      return {
        messages: [],
        toolsExecuted: [],
        memoryLength: 0,
        exit: true,
        error: true,
        inputGuardrailsTriggered: [],
        outputGuardrailsTriggered: [],
      }
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

  private buildTools(activeToolNames: string[]): Tool<TPlugins, TExtraData>[] {
    const availableTools = this.toolDefinitions.filter(tool =>
      activeToolNames.includes(tool.name)
    )
    return availableTools.map(toolDefinition => {
      return tool<any, Context<TPlugins, TExtraData>, any>({
        name: toolDefinition.name,
        description: toolDefinition.description,
        parameters: toolDefinition.schema,
        execute: toolDefinition.func,
      })
    })
  }
}

export * from './types'
