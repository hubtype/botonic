import { Agent } from '@openai/agents'

import { OutputSchema } from './structured-output'
import { retrieveKnowledge, mandatoryTools } from './tools'
import { AIAgent, Tool } from './types'

export class AIAgentBuilder {
  private name: string
  private instructions: string
  private tools: Tool[]

  constructor(
    name: string,
    instructions: string,
    tools: Tool[],
    sourceIds: string[]
  ) {
    this.name = name
    this.instructions = this.addExtraInstructions(instructions)
    this.tools = this.addHubtypeTools(tools, sourceIds)
  }

  build(): AIAgent {
    return new Agent({
      name: this.name,
      instructions: this.instructions,
      tools: this.tools,
      outputType: OutputSchema,
    })
  }

  private addExtraInstructions(instructions: string): string {
    const metadata = `Current Date: ${new Date().toISOString()}`
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
    return `<instructions>\n${instructions}\n</instructions>\n\n<metadata>\n${metadata}\n</metadata>\n\n<output>\n${output}\n</output>`
  }

  private addHubtypeTools(tools: Tool[], sourceIds: string[]): Tool[] {
    const hubtypeTools: Tool[] = [...mandatoryTools]
    if (sourceIds.length > 0) {
      hubtypeTools.push(retrieveKnowledge)
    }
    return [...hubtypeTools, ...tools]
  }
}
