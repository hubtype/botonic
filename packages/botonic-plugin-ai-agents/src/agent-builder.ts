import { ResolvedPlugins } from '@botonic/core'
import { Agent, InputGuardrail, ModelSettings } from '@openai/agents'

import { createInputGuardrail } from './guardrails'
import { OutputSchema } from './structured-output'
import { mandatoryTools, retrieveKnowledge } from './tools'
import { AIAgent, ContactInfo, GuardrailRule, Tool } from './types'

export class AIAgentBuilder<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private name: string
  private instructions: string
  private tools: Tool<TPlugins, TExtraData>[]
  private inputGuardrails: InputGuardrail[]

  constructor(
    name: string,
    instructions: string,
    tools: Tool<TPlugins, TExtraData>[],
    contactInfo: ContactInfo,
    inputGuardrailRules: GuardrailRule[],
    sourceIds: string[]
  ) {
    this.name = name
    this.instructions = this.addExtraInstructions(instructions, contactInfo)
    this.tools = this.addHubtypeTools(tools, sourceIds)
    this.inputGuardrails = []
    if (inputGuardrailRules.length > 0) {
      const inputGuardrail = createInputGuardrail(inputGuardrailRules)
      this.inputGuardrails.push(inputGuardrail)
    }
  }

  build(): AIAgent<TPlugins, TExtraData> {
    const modelSettings: ModelSettings = {}

    if (this.tools.includes(retrieveKnowledge)) {
      modelSettings.toolChoice = retrieveKnowledge.name
      // For model gpt-5-xxx
      modelSettings.temperature = 1
      // For model gpt-5-xxx in AZURE
      modelSettings.providerData = {
        reasoning_effort: 'minimal',
        text_verbosity: 'low',
      }
      // For model gpt-5-xxx directly in OPENAI
      // modelSettings.reasoning = { effort: 'low' }
      // text: { verbosity: 'low' }
    }
    return new Agent({
      name: this.name,
      instructions: this.instructions,
      tools: this.tools,
      outputType: OutputSchema,
      inputGuardrails: this.inputGuardrails,
      outputGuardrails: [],
      modelSettings,
      model: 'gpt-5-nano', //'gpt-5-mini', //'gpt-4.1-mini',
    })
  }

  private addExtraInstructions(
    initialInstructions: string,
    contactInfo: ContactInfo
  ): string {
    const instructions = `<instructions>\n${initialInstructions}\n</instructions>`
    const metadataInstructions = this.getMetadataInstructions()
    const contactInfoInstructions = this.getContactInfoInstructions(contactInfo)
    const outputInstructions = this.getOutputInstructions()
    return `${instructions}\n\n${metadataInstructions}\n\n${contactInfoInstructions}\n\n${outputInstructions}`
  }

  private getContactInfoInstructions(contactInfo: ContactInfo): string {
    const structuredContactInfo = Object.entries(contactInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    return `<contact_info>\n${structuredContactInfo}\n</contact_info>`
  }

  private getMetadataInstructions(): string {
    const metadata = `Current Date: ${new Date().toISOString()}`
    return `<metadata>\n${metadata}\n</metadata>`
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
