import { Agent, Tool } from '@openai/agents'

import { Context } from './context'
import { OutputSchema } from './structured-output'
import { consultKnowledgeBase, mandatoryTools } from './tools'

export class AIAgentBuilder {
  private name: string
  private instructions: string
  private tools: Tool<Context>[]

  constructor(
    name: string,
    instructions: string,
    customTools: Tool<Context>[],
    sourceIds: string[]
  ) {
    this.name = name
    this.instructions = this.addExtraInstructions(instructions)
    this.tools = this.addHubtypeTools(customTools, sourceIds)
  }

  build(): Agent<Context, typeof OutputSchema> {
    return new Agent<Context, typeof OutputSchema>({
      name: this.name,
      instructions: this.instructions,
      tools: this.tools,
      outputType: OutputSchema,
    })
  }

  private addExtraInstructions(instructions: string): string {
    const metadata = `Current Date: ${new Date().toISOString()}`
    const outputExample = JSON.stringify({
      messages: [
        {
          type: 'text',
          content: {
            text: 'Hello, how can I help you today?',
          },
        },
      ],
      numMessages: 1,
    })
    const output = `Return a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${outputExample}\n</example>`
    return `<instructions>\n${instructions}\n</instructions>\n\n<metadata>\n${metadata}\n</metadata>\n\n<output>\n${output}\n</output>`
  }

  private addHubtypeTools(
    customTools: Tool<Context>[],
    sourceIds: string[]
  ): Tool<Context>[] {
    const hubtypeTools: Tool<Context>[] = [...mandatoryTools]
    if (sourceIds.length > 0) {
      hubtypeTools.push(consultKnowledgeBase)
    }
    return [...hubtypeTools, ...customTools]
  }
}
