import { ResolvedPlugins } from '@botonic/core'
import {
  Agent,
  InputGuardrail,
  ModelSettings,
  OutputGuardrail,
} from '@openai/agents'

import { createInputGuardrail } from './guardrails'
import { createOutputGuardrail } from './guardrails/output'
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
  private outputGuardrails: OutputGuardrail<typeof OutputSchema>[]

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
    this.outputGuardrails = []
    if (sourceIds.length > 0) {
      // TODO: in the future, we should allow to pass a list of output guardrails from Flow Builder Frontend
      this.outputGuardrails.push(
        createOutputGuardrail([
          {
            name: 'no_answer',
            description:
              'The agent should be context aware. The agent responds that they do not know or cannot answer the question.',
          },
        ])
      )
    }
  }

  build(): AIAgent<TPlugins, TExtraData> {
    const modelSettings: ModelSettings = {}

    if (this.tools.includes(retrieveKnowledge)) {
      modelSettings.toolChoice = retrieveKnowledge.name
    }

    return new Agent({
      name: this.name,
      instructions: this.instructions,
      tools: this.tools,
      outputType: OutputSchema,
      inputGuardrails: this.inputGuardrails,
      outputGuardrails: this.outputGuardrails,
      modelSettings,
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
