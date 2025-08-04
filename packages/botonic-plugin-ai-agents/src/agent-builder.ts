import { Agent } from '@openai/agents'

import { OutputSchema } from './structured-output'
import { mandatoryTools } from './tools'
import { AIAgent, ContactInfo, Tool } from './types'

export class AIAgentBuilder {
  private name: string
  private instructions: string
  private tools: Tool[]

  constructor(
    name: string,
    instructions: string,
    tools: Tool[],
    contactInfo: ContactInfo
  ) {
    this.name = name
    this.instructions = this.addExtraInstructions(instructions, contactInfo)
    console.log('AI AgentInstructions:\n', this.instructions)
    this.tools = this.addHubtypeTools(tools)
  }

  build(): AIAgent {
    return new Agent({
      name: this.name,
      instructions: this.instructions,
      tools: this.tools,
      outputType: OutputSchema,
    })
  }

  private addExtraInstructions(
    initialInstructions: string,
    contactInfo: ContactInfo
  ): string {
    let instructions = `<instructions>\n${initialInstructions}\n</instructions>`
    instructions = this.addContactInfo(instructions, contactInfo)
    instructions = this.addMetadata(instructions)
    return this.addOutputInstructions(instructions)
  }

  private addContactInfo(
    instructions: string,
    contactInfo: ContactInfo
  ): string {
    const structuredContactInfo = Object.entries(contactInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    return `${instructions}\n\n<contact_info>\n${structuredContactInfo}\n</contact_info>`
  }

  private addMetadata(instructions: string): string {
    const metadata = `Current Date: ${new Date().toISOString()}`
    return `${instructions}\n\n<metadata>\n${metadata}\n</metadata>`
  }

  private addOutputInstructions(instructions: string): string {
    const example = {
      messages: [
        {
          type: 'text',
          content: {
            text: 'Hello, how can I help you today?',
          },
        },
      ],
      numMessages: 1,
    }
    const output = `Return a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${JSON.stringify(example)}\n</example>`
    return `${instructions}\n\n<output>\n${output}\n</output>`
  }

  private addHubtypeTools(tools: Tool[]): Tool[] {
    const hubtypeTools: Tool[] = [...mandatoryTools]
    return [...hubtypeTools, ...tools]
  }
}
