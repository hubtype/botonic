import type {
  AgentOutputType,
  InputGuardrail,
  Model,
  ModelSettings,
} from '@openai/agents'
import type { z } from 'zod'

import { createInputGuardrails } from '../guardrails'
import type { GuardrailTrackingContext } from '../guardrails/input'
import type { LLMConfig } from '../llm-config'
import {
  getOutputInstructions,
  getOutputSchema,
  type OutputSchema,
} from '../structured-output'
import type { GuardrailRule } from '../types'

export interface BaseAgentOptions {
  name: string
  instructions: string
  llmConfig: LLMConfig
  inputGuardrailRules: GuardrailRule[]
  outputMessagesSchemas?: z.ZodObject[]
  guardrailTrackingContext: GuardrailTrackingContext
}

export abstract class BaseAgent {
  protected name: string
  protected instructions: string
  protected llmConfig: LLMConfig
  private inputGuardrailRules: GuardrailRule[]
  private outputMessagesSchemas: z.ZodObject[]
  private guardrailTrackingContext: GuardrailTrackingContext

  constructor(options: BaseAgentOptions) {
    this.name = options.name
    this.instructions = options.instructions
    this.llmConfig = options.llmConfig
    this.inputGuardrailRules = options.inputGuardrailRules
    this.outputMessagesSchemas = options.outputMessagesSchemas || []
    this.guardrailTrackingContext = options.guardrailTrackingContext
  }

  protected getAgentModelSettings(): ModelSettings {
    const modelSettings: ModelSettings = { ...this.llmConfig.modelSettings }

    if (this.llmConfig.modelSettings.reasoning) {
      modelSettings.reasoning = { ...this.llmConfig.modelSettings.reasoning }
    }

    if (this.llmConfig.modelSettings.text) {
      modelSettings.text = { ...this.llmConfig.modelSettings.text }
    }

    return modelSettings
  }

  protected async getInputGuardrails(): Promise<InputGuardrail[]> {
    return await createInputGuardrails(
      this.inputGuardrailRules,
      this.llmConfig,
      this.guardrailTrackingContext
    )
  }

  protected getOutputType(): AgentOutputType<typeof OutputSchema> {
    return getOutputSchema(this.outputMessagesSchemas)
  }

  protected addOutputInstructions(instructions: string): string {
    return `${instructions}\n\n${getOutputInstructions()}`
  }

  protected async getModel(): Promise<string | Model> {
    return await this.llmConfig.getModel()
  }
}
