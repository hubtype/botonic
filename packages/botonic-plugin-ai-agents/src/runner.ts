import { Agent, Runner } from '@openai/agents'
import { Context } from './context'
import { setUpOpenAI } from './openai'
import { OutputSchema } from './structured-output'
import { AgenticInputMessage, AgenticOutputMessage } from './types'

export class AIAgentRunner {
  private agent: Agent<Context, typeof OutputSchema>

  constructor(agent: Agent<Context, typeof OutputSchema>) {
    this.agent = agent
  }

  async run(
    messages: AgenticInputMessage[],
    context: Context
  ): Promise<AgenticOutputMessage[]> {
    const runner = new Runner({
      modelSettings: { temperature: 0 },
    })
    const result = await runner.run(this.agent, messages, { context })
    return result.finalOutput?.messages || []
  }
}
