import type {
  AiAgentArgs,
  BotContext,
  Plugin,
  ResolvedPlugins,
} from '@botonic/core'
import { tool } from '@openai/agents'

import { AIAgentBuilder } from './agent-builder'
import { isProd, MAX_MEMORY_LENGTH } from './constants'
import { createDebugLogger, type DebugLogger } from './debug-logger'
import { HubtypeApiClient } from './hubtype-api-client'
import { setUpOpenAI } from './openai'
import { AIAgentRunner } from './runner'
import type {
  AgenticInputMessage,
  Context,
  CustomTool,
  InferenceResponse,
  MemoryOptions,
  MessageHistoryApiVersion,
  PluginAiAgentOptions,
  Tool,
} from './types'

export default class BotonicPluginAiAgents<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> implements Plugin
{
  private readonly authToken?: string
  private readonly messageHistoryApiVersion: MessageHistoryApiVersion
  private readonly memory: MemoryOptions
  private readonly logger: DebugLogger
  public toolDefinitions: CustomTool<TPlugins, TExtraData>[] = []

  constructor(options?: PluginAiAgentOptions<TPlugins, TExtraData>) {
    setUpOpenAI(options?.maxRetries, options?.timeout)

    if (options?.messageHistoryApiVersion === 'v1' && options?.memory) {
      throw new Error(
        'Cannot use memory when messageHistoryApiVersion is "v1". ' +
          'Either set messageHistoryApiVersion to "v2" or remove memory.'
      )
    }

    this.authToken = options?.authToken
    this.toolDefinitions = options?.customTools || []
    this.messageHistoryApiVersion = options?.messageHistoryApiVersion ?? 'v2'
    this.memory = options?.memory ?? {}
    this.logger = createDebugLogger(options?.enableDebug ?? false)

    this.logger.logInitialConfig({
      messageHistoryApiVersion: this.messageHistoryApiVersion,
      maxRetries: options?.maxRetries ?? 2,
      timeout: options?.timeout ?? 16000,
      customToolNames: this.toolDefinitions.map(t => t.name),
      memory: this.memory,
    })
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
      const agent = new AIAgentBuilder<TPlugins, TExtraData>({
        name: aiAgentArgs.name,
        instructions: aiAgentArgs.instructions,
        tools: tools,
        contactInfo: request.session.user.contact_info || [],
        inputGuardrailRules: aiAgentArgs.inputGuardrailRules || [],
        sourceIds: aiAgentArgs.sourceIds || [],
        campaignsContext: request.input.context?.campaigns_v2,
        logger: this.logger,
      }).build()

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

      this.logger.logAgentDebugInfo(
        aiAgentArgs,
        tools.map(t => t.name),
        messages
      )

      const runner = new AIAgentRunner<TPlugins, TExtraData>(agent, this.logger)
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
    const hubtypeClient = new HubtypeApiClient(authToken)

    if (!isProd) {
      return await hubtypeClient.getLocalMessages(memoryLength)
    }

    if (this.messageHistoryApiVersion === 'v1') {
      return await hubtypeClient.getMessages(request, memoryLength)
    }

    // Default to V2
    const result = await hubtypeClient.getMessagesV2(request, {
      maxMessages: this.memory.maxMessages ?? memoryLength,
      includeToolCalls: this.memory.includeToolCalls ?? true,
      maxFullToolResults: this.memory.maxFullToolResults ?? 1,
      debugMode: this.memory.debugMode ?? false,
    })
    return result.messages
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
