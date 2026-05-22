import type { CampaignV2, ContactInfo, ResolvedPlugins } from '@botonic/core'
import { Agent, type AgentOutputType, type ModelSettings } from '@openai/agents'
import type { z } from 'zod'
import { OPENAI_PROVIDER } from '../constants'
import type { DebugLogger } from '../debug-logger'
import type { GuardrailTrackingContext } from '../guardrails/input'
import type { LLMConfig } from '../llm-config'
import type { OutputSchema } from '../structured-output'
import {
  createRetrieveKnowledge,
  mandatoryTools,
  RETRIEVE_KNOWLEDGE_TOOL_NAME,
} from '../tools'
import type { AIAgent, Context, GuardrailRule, Tool } from '../types'
import { BaseAgent } from './base-agent'

interface SpecialistAgentOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> {
  name: string
  instructions: string
  tools: Tool<TPlugins, TExtraData>[]
  campaignsContext?: CampaignV2[]
  contactInfo: ContactInfo[]
  inputGuardrailRules: GuardrailRule[]
  sourceIds: string[]
  outputMessagesSchemas?: z.ZodObject[]
  llmConfig: LLMConfig
  logger: DebugLogger
  guardrailTrackingContext: GuardrailTrackingContext
}

export class SpecialistAgent<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> extends BaseAgent {
  private tools: Tool<TPlugins, TExtraData>[]
  private logger: DebugLogger
  private agent!: AIAgent<TPlugins, TExtraData>

  private constructor(options: SpecialistAgentOptions<TPlugins, TExtraData>) {
    super({
      name: options.name,
      instructions: options.instructions,
      llmConfig: options.llmConfig,
      inputGuardrailRules: options.inputGuardrailRules,
      outputMessagesSchemas: options.outputMessagesSchemas,
      guardrailTrackingContext: options.guardrailTrackingContext,
    })
    this.instructions = this.addExtraInstructions(
      options.instructions,
      options.contactInfo,
      options.campaignsContext
    )
    this.tools = this.addHubtypeTools(options.tools, options.sourceIds)
    this.logger = options.logger
  }

  static async create<
    TPlugins extends ResolvedPlugins = ResolvedPlugins,
    TExtraData = unknown,
  >(
    options: SpecialistAgentOptions<TPlugins, TExtraData>
  ): Promise<SpecialistAgent<TPlugins, TExtraData>> {
    const specialistAgent = new SpecialistAgent<TPlugins, TExtraData>(options)
    const model = specialistAgent.llmConfig.modelName
    const resolvedModel = await specialistAgent.getModel()
    const hasRetrieveKnowledge = specialistAgent.tools.some(
      tool => tool.name === RETRIEVE_KNOWLEDGE_TOOL_NAME
    )
    const modelSettings =
      specialistAgent.getSpecialistModelSettings(hasRetrieveKnowledge)
    const inputGuardrails = await specialistAgent.getInputGuardrails()

    specialistAgent.logger.logModelSettings({
      provider: OPENAI_PROVIDER,
      model,
      reasoning: modelSettings.reasoning as { effort: string } | undefined,
      text: modelSettings.text as { verbosity: string } | undefined,
      toolChoice: modelSettings.toolChoice,
      hasRetrieveKnowledge,
    })

    const agent = new Agent<
      Context<TPlugins, TExtraData>,
      AgentOutputType<typeof OutputSchema>
    >({
      name: specialistAgent.name,
      model: resolvedModel,
      modelSettings,
      instructions: specialistAgent.instructions,
      tools: specialistAgent.tools,
      outputType: specialistAgent.getOutputType(),
      inputGuardrails,
      outputGuardrails: [],
    })

    specialistAgent.agent = agent
    return specialistAgent
  }

  getAgent(): AIAgent<TPlugins, TExtraData> {
    return this.agent
  }

  private getSpecialistModelSettings(
    hasRetrieveKnowledge: boolean
  ): ModelSettings {
    const modelSettings = this.getAgentModelSettings()
    if (hasRetrieveKnowledge) {
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
    return this.addOutputInstructions(
      `${instructions}\n\n${metadataInstructions}\n\n${contactInfoInstructions}\n\n${campaignInstructions}`
    )
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
