import type { CampaignV2, ContactInfo, ResolvedPlugins } from '@botonic/core'
import {
  Agent,
  type AgentOutputType,
  type InputGuardrail,
  type ModelSettings,
} from '@openai/agents'
import type { z } from 'zod'

import { OPENAI_PROVIDER } from './constants'
import type { DebugLogger } from './debug-logger'
import { createInputGuardrails } from './guardrails'
import type { GuardrailTrackingContext } from './guardrails/input'
import type { LLMConfig } from './llm-config'
import {
  getOutputInstructions,
  getOutputSchema,
  type OutputSchema,
} from './structured-output'
import {
  createRetrieveKnowledge,
  mandatoryTools,
  RETRIEVE_KNOWLEDGE_TOOL_NAME,
} from './tools'
import type { AIAgent, Context, GuardrailRule, Tool } from './types'

interface AIAgentBuilderOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  name: string
  instructions: string
  tools: Tool<TPlugins, TExtraData>[]
  campaignsContext?: CampaignV2[]
  contactInfo: ContactInfo[]
  inputGuardrailRules: GuardrailRule[]
  sourceIds: string[]
  outputMessagesSchemas?: z.ZodObject<any>[]
  llmConfig: LLMConfig
  logger: DebugLogger
  guardrailTrackingContext: GuardrailTrackingContext
}

export class AIAgentBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private name: string
  private instructions: string
  private tools: Tool<TPlugins, TExtraData>[]
  private externalOutputMessagesSchemas: z.ZodObject<any>[]
  private inputGuardrails: InputGuardrail[]
  public llmConfig: LLMConfig
  private logger: DebugLogger
  private inputGuardrailRules: GuardrailRule[]
  private guardrailTrackingContext: GuardrailTrackingContext

  constructor(options: AIAgentBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = this.addExtraInstructions(
      options.instructions,
      options.contactInfo,
      options.campaignsContext
    )
    this.tools = this.addHubtypeTools(options.tools, options.sourceIds)
    this.externalOutputMessagesSchemas = options.outputMessagesSchemas || []
    this.inputGuardrails = []
    this.llmConfig = options.llmConfig
    this.logger = options.logger
    this.inputGuardrailRules = options.inputGuardrailRules
    this.guardrailTrackingContext = options.guardrailTrackingContext
  }

  async build(): Promise<AIAgent<TPlugins, TExtraData>> {
    // When using standard OpenAI API, we need to specify the model.
    // Azure OpenAI uses deployment name instead.
    const model = this.llmConfig.modelName
    const resolvedModel = await this.llmConfig.getModel()
    const hasRetrieveKnowledge = this.tools.some(
      tool => tool.name === RETRIEVE_KNOWLEDGE_TOOL_NAME
    )
    const modelSettings = this.getAgentModelSettings(hasRetrieveKnowledge)

    this.inputGuardrails = await createInputGuardrails(
      this.inputGuardrailRules,
      this.llmConfig,
      this.guardrailTrackingContext
    )

    this.logger.logModelSettings({
      provider: OPENAI_PROVIDER,
      model,
      reasoning: modelSettings.reasoning as { effort: string } | undefined,
      text: modelSettings.text as { verbosity: string } | undefined,
      toolChoice: modelSettings.toolChoice as string | undefined,
      hasRetrieveKnowledge,
    })

    return new Agent<
      Context<TPlugins, TExtraData>,
      AgentOutputType<typeof OutputSchema>
    >({
      name: this.name,
      model: resolvedModel,
      modelSettings,
      instructions: this.instructions,
      tools: this.tools,
      outputType: getOutputSchema(this.externalOutputMessagesSchemas),
      inputGuardrails: this.inputGuardrails,
      outputGuardrails: [],
    })
  }

  private getAgentModelSettings(hasRetrieveKnowledge: boolean): ModelSettings {
    const modelSettings: ModelSettings = { ...this.llmConfig.modelSettings }
    if (this.llmConfig.modelSettings.reasoning) {
      modelSettings.reasoning = { ...this.llmConfig.modelSettings.reasoning }
    }
    if (this.llmConfig.modelSettings.text) {
      modelSettings.text = { ...this.llmConfig.modelSettings.text }
    }

    if (hasRetrieveKnowledge) {
      // && this.llmConfig.modelName.includes('gpt-4')) {
      modelSettings.toolChoice = RETRIEVE_KNOWLEDGE_TOOL_NAME
    }

    return modelSettings
  }

  private addExtraInstructions(
    initialInstructions: string,
    contactInfo: ContactInfo[],
    campaignsContext?: CampaignV2[]
  ): string {
    const instructions = `<instructions>\n${initialInstructions.trim()}\n</instructions>`
    const metadataInstructions = this.getMetadataInstructions()
    const contactInfoInstructions = this.getContactInfoInstructions(contactInfo)
    const campaignInstructions = this.getCampaignInstructions(campaignsContext)
    const outputInstructions = getOutputInstructions()
    return `${instructions}\n\n${metadataInstructions}\n\n${contactInfoInstructions}\n\n${campaignInstructions}\n\n${outputInstructions}`
  }

  private getContactInfoInstructions(contactInfo: ContactInfo[]): string {
    const structuredContactInfo = contactInfo
      .map(
        info =>
          ` <contact_info>
              <name>${info.name}</name>
              <value>${info.value}</value>
              <type>${info.type}</type>
              ${
                info.description
                  ? `<description>${info.description}</description>`
                  : ''
              }
            </contact_info>`
      )
      .join('\n')
    return `<contact_info_fields>\n${structuredContactInfo}</contact_info_fields>`
  }

  private getMetadataInstructions(): string {
    const metadata = `Current Date: ${new Date().toISOString()}`
    return `<metadata>\n${metadata}\n</metadata>`
  }

  private getCampaignInstructions(campaignsContext?: CampaignV2[]): string {
    if (!campaignsContext || campaignsContext.length === 0) {
      return ''
    }
    const campaignsWithContext = campaignsContext.filter(
      campaign => campaign.agent_context
    )
    if (campaignsWithContext.length === 0) {
      return ''
    }
    return campaignsWithContext
      .map(
        (campaign, index) =>
          `<campaign_context_${index + 1}>\n${campaign.agent_context}\n</campaign_context_${index + 1}>`
      )
      .join('\n')
  }

  private addHubtypeTools(
    tools: Tool<TPlugins, TExtraData>[],
    sourceIds: string[]
  ): Tool<TPlugins, TExtraData>[] {
    const hubtypeTools: Tool[] = [...mandatoryTools]
    if (sourceIds.length > 0) {
      hubtypeTools.push(createRetrieveKnowledge(sourceIds))
    }
    return [...hubtypeTools, ...tools]
  }
}
