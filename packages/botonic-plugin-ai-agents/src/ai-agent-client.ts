import {
  Agent,
  AssistantMessageItem,
  RunConfig,
  Runner,
  setDefaultOpenAIKey,
  setTracingDisabled,
  Tool,
  UserMessageItem,
} from '@openai/agents'

import { OPENAI_API_KEY } from './constants'
import { AgenticMessage } from './types'

export class AiAgentClient {
  name: string
  instructions: string
  tools: Tool[]
  agent: Agent

  constructor(name: string, instructions: string) {
    console.log('OPENAI_API_KEY', OPENAI_API_KEY)
    setDefaultOpenAIKey(OPENAI_API_KEY)
    setTracingDisabled(true)
    this.name = name
    this.instructions = instructions
    this.tools = []
    console.log('instructions', this.instructions)
    this.agent = new Agent({
      name: this.name,
      instructions: this.instructions,
      model: 'gpt-4.1-mini',
      tools: this.tools,
    })
  }

  async run(_messages: AgenticMessage[]): Promise<string | undefined> {
    const runConfig: Partial<RunConfig> = {
      model: 'gpt-4.1-mini',
      modelSettings: {
        temperature: 0.5,
      },
      tracingDisabled: true,
    }
    const runner = new Runner(runConfig)
    const response = await runner.run(this.agent, 'En que me puedes ayudar?')

    return response.finalOutput
  }
}
