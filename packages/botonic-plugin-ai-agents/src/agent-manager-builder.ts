import type { CampaignV2, ContactInfo, ResolvedPlugins } from '@botonic/core'
import {
  Agent,
  type AgentOutputType,
  type Handoff,
  type ModelSettings,
} from '@openai/agents'
import type { z } from 'zod'

import { createInputGuardrails } from './guardrails'
import type { GuardrailTrackingContext } from './guardrails/input'
import type { LLMConfig } from './llm-config'
import {
  getOutputInstructions,
  getOutputSchema,
  type OutputSchema,
} from './structured-output'
import type { AIAgent, Context, GuardrailRule, Tool } from './types'

interface AIAgentManagerBuilderOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  name: string
  instructions: string
  tools: Tool<TPlugins, TExtraData>[]
  campaignsContext?: CampaignV2[]
  contactInfo: ContactInfo[]
  llmConfig: LLMConfig
  inputGuardrailRules: GuardrailRule[]
  outputMessagesSchemas?: z.ZodObject[]
  guardrailTrackingContext: GuardrailTrackingContext
}

export class AIAgentManagerBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  private name: string
  private instructions: string
  private tools: Tool<TPlugins, TExtraData>[]
  private campaignsContext?: CampaignV2[]
  private contactInfo: ContactInfo[]
  private llmConfig: LLMConfig
  private handoffs: Handoff<
    Context<TPlugins, TExtraData>,
    AgentOutputType<typeof OutputSchema>
  >[]
  private inputGuardrailRules: GuardrailRule[]
  private outputMessagesSchemas: z.ZodObject[]
  private guardrailTrackingContext: GuardrailTrackingContext

  constructor(options: AIAgentManagerBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = options.instructions
    this.tools = options.tools
    this.campaignsContext = options.campaignsContext
    this.contactInfo = options.contactInfo
    this.llmConfig = options.llmConfig
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
    const resolvedModel = await this.llmConfig.getModel()

    return new Agent<
      Context<TPlugins, TExtraData>,
      AgentOutputType<typeof OutputSchema>
    >({
      name: this.name,
      model: resolvedModel,
      modelSettings,
      instructions: `${this.instructions}\n\n${getOutputInstructions()}`,
      tools: this.tools,
      outputType: getOutputSchema(this.outputMessagesSchemas),
      inputGuardrails,
      outputGuardrails: [],
    })
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
