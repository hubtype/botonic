import {
  type AIAgentRouterArgs,
  type AiAgentArgs,
  AiAgentType,
  type AiAgentWorkerArgs,
  type BotContext,
  type HubtypeAssistantMessage,
  type Plugin,
  type ResolvedPlugins,
  VerbosityLevel,
} from '@botonic/core'
import { Agent, handoff, setTracingDisabled, tool } from '@openai/agents'
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions'
import { v7 as uuidv7 } from 'uuid'
import type { ZodObject } from 'zod'

import { AIAgentBuilder } from './agent-builder'
import {
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT_16_SECONDS,
  isProd,
  MAX_MEMORY_LENGTH,
} from './constants'
import { createDebugLogger, type DebugLogger } from './debug-logger'
import {
  createInputGuardrails,
  type GuardrailTrackingContext,
} from './guardrails'
import { LLMConfig } from './llm-config'
import { AIAgentRunner } from './runner'
import { AIAgentRouterRunner } from './runner-router'
import { HubtypeApiClient } from './services/hubtype-api-client'
import type {
  AgenticInputMessage,
  AIAgent,
  Context,
  CustomTool,
  InferenceResponse,
  MemoryOptions,
  PluginAiAgentOptions,
  Tool,
} from './types'

export default class BotonicPluginAiAgents<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> implements Plugin
{
  private readonly authToken?: string
  private readonly memory: MemoryOptions
  private readonly logger: DebugLogger
  private readonly timeout: number
  private readonly maxRetries: number
  public toolDefinitions: CustomTool<TPlugins, TExtraData>[] = []
  private readonly localStorageKey: string

  constructor(options?: PluginAiAgentOptions<TPlugins, TExtraData>) {
    this.authToken = options?.authToken
    this.toolDefinitions = options?.customTools || []
    this.memory = this.getMemoryOptions(options?.memory)
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT_16_SECONDS
    this.maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES
    this.logger = createDebugLogger(options?.enableDebug ?? false)
    this.localStorageKey = options?.localStorageKey ?? 'botonicState'
    setTracingDisabled(true)

    this.logger.logInitialConfig({
      messageHistoryApiVersion: 'v2',
      maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
      timeout: options?.timeout ?? DEFAULT_TIMEOUT_16_SECONDS,
      customToolNames: this.toolDefinitions.map(t => t.name),
      memory: this.memory,
    })
  }

  private getMemoryOptions(memory?: Partial<MemoryOptions>): MemoryOptions {
    return {
      maxMessages: memory?.maxMessages ?? MAX_MEMORY_LENGTH,
      includeToolCalls: memory?.includeToolCalls ?? true,
      maxFullToolResults: memory?.maxFullToolResults ?? 1,
      debugMode: memory?.debugMode ?? false,
    }
  }

  pre(): void {
    return
  }

  async getInference(
    botContext: BotContext<TPlugins, TExtraData>,
    aiAgentArgs: AiAgentArgs
  ): Promise<InferenceResponse> {
    const authToken = isProd ? botContext.session._access_token : this.authToken
    if (!authToken) {
      throw new Error('Auth token is required')
    }

    const inferenceId = uuidv7()

    try {
      if (aiAgentArgs.type === AiAgentType.Worker) {
        return await this.executeWorkerAIAgent(
          botContext,
          aiAgentArgs,
          authToken,
          inferenceId
        )
      }

      if (aiAgentArgs.type === AiAgentType.Router) {
        return await this.executeRouterAIAgent(
          botContext,
          aiAgentArgs,
          authToken,
          inferenceId
        )
      }

      throw new Error('Invalid agent type')
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

  private async executeWorkerAIAgent(
    botContext: BotContext<TPlugins, TExtraData>,
    aiAgentArgs: AiAgentWorkerArgs,
    authToken: string,
    inferenceId: string
  ) {
    // Get LLM config, tools and agent
    const { llmConfig, tools, agent } = this.getLLMConfigToolsAndAIAgent(
      botContext,
      aiAgentArgs,
      aiAgentArgs.outputMessagesSchemas || [],
      authToken,
      inferenceId
    )

    // Get messages
    const messages = await this.getMessages(
      botContext,
      authToken,
      aiAgentArgs.previousHubtypeMessages || []
    )

    // Build context
    const context: Context<TPlugins, TExtraData> = {
      authToken,
      sourceIds: aiAgentArgs.sourceIds || [],
      knowledgeUsed: {
        query: '',
        sourceIds: [],
        chunksIds: [],
        chunkTexts: [],
      },
      request: botContext,
    }

    // Log agent debug info
    this.logger.logAgentDebugInfo(
      aiAgentArgs,
      tools.map(t => t.name),
      messages
    )

    // Run agent
    const runner = new AIAgentRunner<TPlugins, TExtraData>(
      agent,
      llmConfig,
      inferenceId,
      this.logger
    )
    return await runner.run(messages, context)
  }

  private async executeRouterAIAgent(
    botContext: BotContext<TPlugins, TExtraData>,
    aiAgentArgs: AIAgentRouterArgs,
    authToken: string,
    inferenceId: string
  ) {
    const { agents, model, name, instructions } = aiAgentArgs

    const handoffAgents = agents.map(aiAgentData => {
      const { agent } = this.getLLMConfigToolsAndAIAgent(
        botContext,
        aiAgentData,
        aiAgentArgs.outputMessagesSchemas || [],
        authToken,
        inferenceId
      )
      return handoff(agent, {
        toolNameOverride: aiAgentData.name,
        toolDescriptionOverride: aiAgentData.description,
        // TODO: Review if is possible use onHandoff action to track the handoff
        // onHandoff: result => {
        //   console.log('onHandoff', aiAgentData.name, result)
        // },
        // TODO: when onHandoff function is defined, we need to provide inputType
        // inputType: ????,
        // isEnabled: (context: RunContext<any>) => {
        //   return true
        // },
      })
    })

    const routerLlmConfig = new LLMConfig(
      this.maxRetries,
      this.timeout,
      model,
      VerbosityLevel.Medium
    )
    const guardrailTrackingContext: GuardrailTrackingContext = {
      botId: botContext.session.bot.id,
      isTest: botContext.session.is_test_integration,
      authToken,
      inferenceId,
    }
    const inputGuardrails = createInputGuardrails(
      aiAgentArgs.inputGuardrailRules || [],
      routerLlmConfig,
      guardrailTrackingContext
    )

    // Agent.create is typed as Agent<UnknownContext>; we run with Context<TPlugins, TExtraData>.
    const agentRouter = Agent.create({
      name,
      model,
      instructions: RECOMMENDED_PROMPT_PREFIX + instructions,
      handoffs: handoffAgents,
      inputGuardrails,
    }) as AIAgent<TPlugins, TExtraData>

    // Get messages
    const messages = await this.getMessages(
      botContext,
      authToken,
      aiAgentArgs.previousHubtypeMessages || []
    )

    // Build context
    const context: Context<TPlugins, TExtraData> = {
      authToken,
      sourceIds: [],
      knowledgeUsed: {
        query: '',
        sourceIds: [],
        chunksIds: [],
        chunkTexts: [],
      },
      request: botContext,
    }

    // Run agent
    const runner = new AIAgentRouterRunner<TPlugins, TExtraData>(
      agentRouter,
      routerLlmConfig,
      inferenceId,
      this.logger
    )

    return await runner.run(messages, context)
  }

  private getLLMConfigToolsAndAIAgent(
    botContext: BotContext,
    aiAgentArgs: AiAgentArgs,
    outputMessagesSchemas: ZodObject<any>[],
    authToken: string,
    inferenceId: string
  ) {
    // Create client for OpenAI/Azure OpenAI
    const llmConfig = new LLMConfig(
      this.maxRetries,
      this.timeout,
      aiAgentArgs.model,
      aiAgentArgs.verbosity
    )

    // Build tools
    const tools = this.buildTools(aiAgentArgs)

    // Build agent
    const sourceIds =
      aiAgentArgs.type === AiAgentType.Worker ? aiAgentArgs.sourceIds : []
    const agent = new AIAgentBuilder<TPlugins, TExtraData>({
      name: aiAgentArgs.name,
      instructions: aiAgentArgs.instructions,
      tools: tools,
      contactInfo: botContext.session.user.contact_info || [],
      inputGuardrailRules: aiAgentArgs.inputGuardrailRules || [],
      sourceIds,
      outputMessagesSchemas: outputMessagesSchemas || [],
      campaignsContext: botContext.input.context?.campaigns_v2,
      logger: this.logger,
      llmConfig,
      guardrailTrackingContext: {
        botId: botContext.session.bot.id,
        isTest: botContext.session.is_test_integration,
        authToken,
        inferenceId,
      },
    }).build()

    return { llmConfig, tools, agent }
  }

  private async getMessages(
    botContext: BotContext,
    authToken: string,
    previousHubtypeMessages: HubtypeAssistantMessage[]
  ): Promise<AgenticInputMessage[]> {
    const hubtypeClient = new HubtypeApiClient(authToken)
    if (!isProd) {
      return await hubtypeClient.getLocalMessages(
        MAX_MEMORY_LENGTH,
        previousHubtypeMessages,
        this.localStorageKey
      )
    }

    // Default to V2
    const result = await hubtypeClient.getMessagesV2(
      botContext,
      this.memory,
      previousHubtypeMessages
    )
    return result.messages
  }

  private buildTools(aiAgentArgs: AiAgentArgs): Tool<TPlugins, TExtraData>[] {
    const activeTools =
      aiAgentArgs.type === AiAgentType.Worker ? aiAgentArgs.activeTools : []
    const activeToolNames = activeTools.map(tool => tool.name)
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

export * from './bot-config-tools'
export * from './types'
