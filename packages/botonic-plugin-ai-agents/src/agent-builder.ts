import { CampaignV2, ContactInfo, ResolvedPlugins } from '@botonic/core'
import {
  Agent,
  AgentOutputType,
  // hostedMcpTool,
  InputGuardrail,
  MCPServerStreamableHttp,
  ModelSettings,
} from '@openai/agents'

import { OPENAI_MODEL, OPENAI_PROVIDER } from './constants'
import { DebugLogger } from './debug-logger'
import { createInputGuardrail } from './guardrails'
import { OutputSchema } from './structured-output'
import { mandatoryTools, retrieveKnowledge } from './tools'
import { AIAgent, Context, GuardrailRule, Tool } from './types'

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
  logger: DebugLogger
}

export class AIAgentBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private name: string
  private instructions: string
  private tools: Tool<TPlugins, TExtraData>[]
  private inputGuardrails: InputGuardrail[]
  private logger: DebugLogger

  constructor(options: AIAgentBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = this.addExtraInstructions(
      options.instructions,
      options.contactInfo,
      options.campaignsContext
    )
    this.tools = this.addHubtypeTools(options.tools, options.sourceIds)
    this.inputGuardrails = []
    this.logger = options.logger
    if (options.inputGuardrailRules.length > 0) {
      const inputGuardrail = createInputGuardrail(options.inputGuardrailRules)
      this.inputGuardrails.push(inputGuardrail)
    }
  }

  build(): AIAgent<TPlugins, TExtraData> {
    const modelSettings: ModelSettings = {} as ModelSettings
    if (OPENAI_PROVIDER === 'openai') {
      modelSettings.reasoning = { effort: 'none' }
      modelSettings.text = { verbosity: 'medium' }
    }

    const hasRetrieveKnowledge = this.tools.includes(retrieveKnowledge)
    if (hasRetrieveKnowledge && OPENAI_PROVIDER === 'azure') {
      modelSettings.toolChoice = retrieveKnowledge.name
    }

    // When using standard OpenAI API, we need to specify the model
    // Azure OpenAI uses deployment name instead
    const model = OPENAI_PROVIDER === 'openai' ? OPENAI_MODEL : undefined

    this.logger.logModelSettings({
      provider: OPENAI_PROVIDER,
      model,
      reasoning: modelSettings.reasoning as { effort: string } | undefined,
      text: modelSettings.text as { verbosity: string } | undefined,
      toolChoice: modelSettings.toolChoice as string | undefined,
      hasRetrieveKnowledge,
    })

    // Only supported for the OpenAI Responses API
    // const gitMcpServerAsTool = hostedMcpTool({
    //   serverLabel: 'gitmcp',
    //   serverUrl: 'https://gitmcp.io/hubtype/botonic',
    // })

    const gitMcpServer = new MCPServerStreamableHttp({
      url: 'https://gitmcp.io/openai/codex',
      name: 'GitMCP Documentation Server',
    })

    return new Agent<
      Context<TPlugins, TExtraData>,
      AgentOutputType<typeof OutputSchema>
    >({
      name: this.name,
      model,
      instructions: this.instructions,
      tools: this.tools, // [...this.tools, gitMcpServerAsTool]
      mcpServers: [gitMcpServer],
      outputType: OutputSchema,
      inputGuardrails: this.inputGuardrails,
      outputGuardrails: [],
      modelSettings,
    })
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
    const outputInstructions = this.getOutputInstructions()
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

  private getOutputInstructions(): string {
    const example = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'Hello, how can I help you today?',
          },
        },
      ],
    }
    const output = `Return a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${JSON.stringify(example)}\n</example>`
    return `<output>\n${output}\n</output>`
  }

  private addHubtypeTools(
    tools: Tool<TPlugins, TExtraData>[],
    sourceIds: string[]
  ): Tool<TPlugins, TExtraData>[] {
    const hubtypeTools: Tool[] = [...mandatoryTools]
    if (sourceIds.length > 0) {
      hubtypeTools.push(retrieveKnowledge)
    }
    return [...hubtypeTools, ...tools]
  }
}
