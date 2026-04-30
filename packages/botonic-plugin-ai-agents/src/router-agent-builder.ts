import { type ResolvedPlugins, VerbosityLevel } from '@botonic/core'
import {
  Agent,
  type AgentOutputType,
  type Handoff,
  type ModelSettings,
} from '@openai/agents'
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions'
import type { z } from 'zod'

import { createInputGuardrails } from './guardrails'
import type { GuardrailTrackingContext } from './guardrails/input'
import { LLMConfig } from './llm-config'
import {
  getOutputInstructions,
  getOutputSchema,
  type OutputSchema,
} from './structured-output'
import type { AIAgent, Context, GuardrailRule } from './types'

interface AIAgentRouterBuilderOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  name: string
  instructions: string
  model: string
  handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  inputGuardrailRules: GuardrailRule[]
  outputMessagesSchemas?: z.ZodObject[]
  maxRetries: number
  timeout: number
  guardrailTrackingContext: GuardrailTrackingContext
}

export class AIAgentRouterBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  private name: string
  private instructions: string
  private model: string
  private handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  private inputGuardrailRules: GuardrailRule[]
  private outputMessagesSchemas: z.ZodObject[]
  private maxRetries: number
  private timeout: number
  private guardrailTrackingContext: GuardrailTrackingContext

  constructor(options: AIAgentRouterBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = options.instructions
    this.model = options.model
    this.handoffs = options.handoffs
    this.inputGuardrailRules = options.inputGuardrailRules
    this.outputMessagesSchemas = options.outputMessagesSchemas || []
    this.maxRetries = options.maxRetries
    this.timeout = options.timeout
    this.guardrailTrackingContext = options.guardrailTrackingContext
  }

  async build(): Promise<{
    llmConfig: LLMConfig
    agent: AIAgent<TPlugins, TExtraData>
  }> {
    const llmConfig = new LLMConfig(
      this.maxRetries,
      this.timeout,
      this.model,
      VerbosityLevel.Medium
    )
    const inputGuardrails = await createInputGuardrails(
      this.inputGuardrailRules,
      llmConfig,
      this.guardrailTrackingContext
    )
    const modelSettings = this.getRouterModelSettings(llmConfig)

    // Agent.create is typed as Agent<UnknownContext>; we run with Context<TPlugins, TExtraData>.
    const agent = Agent.create({
      name: this.name,
      model: await llmConfig.getModel(),
      modelSettings,
      instructions: `${RECOMMENDED_PROMPT_PREFIX}${this.instructions}\n\n${getOutputInstructions()}`,
      handoffs: this.handoffs,
      outputType: getOutputSchema(this.outputMessagesSchemas),
      inputGuardrails,
    }) as AIAgent<TPlugins, TExtraData>

    return { llmConfig, agent }
  }

  private getRouterModelSettings(llmConfig: LLMConfig): ModelSettings {
    const modelSettings: ModelSettings = { ...llmConfig.modelSettings }
    if (llmConfig.modelSettings.reasoning) {
      modelSettings.reasoning = { ...llmConfig.modelSettings.reasoning }
    }
    if (llmConfig.modelSettings.text) {
      modelSettings.text = { ...llmConfig.modelSettings.text }
    }
    return modelSettings
  }
}
