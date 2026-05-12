import type { ResolvedPlugins } from '@botonic/core'
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
import type { LLMConfig } from './llm-config'
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
  llmConfig: LLMConfig
  handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  inputGuardrailRules: GuardrailRule[]
  outputMessagesSchemas?: z.ZodObject[]
  guardrailTrackingContext: GuardrailTrackingContext
}

export class AIAgentRouterBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  private name: string
  private instructions: string
  private llmConfig: LLMConfig
  private handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  private inputGuardrailRules: GuardrailRule[]
  private outputMessagesSchemas: z.ZodObject[]
  private guardrailTrackingContext: GuardrailTrackingContext

  constructor(options: AIAgentRouterBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = options.instructions
    this.llmConfig = options.llmConfig
    this.handoffs = options.handoffs
    this.inputGuardrailRules = options.inputGuardrailRules
    this.outputMessagesSchemas = options.outputMessagesSchemas || []
    this.guardrailTrackingContext = options.guardrailTrackingContext
  }

  async build(): Promise<AIAgent<TPlugins, TExtraData>> {
    const inputGuardrails = await createInputGuardrails(
      this.inputGuardrailRules,
      this.llmConfig,
      this.guardrailTrackingContext
    )
    const modelSettings = this.getAgentModelSettings()

    // Agent.create is typed as Agent<UnknownContext>; we run with Context<TPlugins, TExtraData>.
    const agent = Agent.create({
      name: this.name,
      model: await this.llmConfig.getModel(),
      modelSettings,
      instructions: `${RECOMMENDED_PROMPT_PREFIX}${this.instructions}\n\n${getOutputInstructions()}`,
      handoffs: this.handoffs,
      outputType: getOutputSchema(this.outputMessagesSchemas),
      inputGuardrails,
    }) as AIAgent<TPlugins, TExtraData>

    return agent
  }

  private getAgentModelSettings(): ModelSettings {
    const modelSettings: ModelSettings = { ...this.llmConfig.modelSettings }
    if (this.llmConfig.modelSettings.reasoning) {
      modelSettings.reasoning = { ...this.llmConfig.modelSettings.reasoning }
    }
    if (this.llmConfig.modelSettings.text) {
      modelSettings.text = { ...this.llmConfig.modelSettings.text }
    }
    return modelSettings
  }
}
