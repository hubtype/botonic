import { Agent, Runner } from '@openai/agents'
import { OutputSchema } from './structured-output'
import { AgenticInputMessage, AgenticOutputMessage, Context } from './types'

export class AIAgentRunner {
  private agent: Agent<Context, typeof OutputSchema>

  constructor(agent: Agent<Context, typeof OutputSchema>) {
    this.agent = agent
  }

  async run(
    messages: AgenticInputMessage[],
    context: Context,
    maxRetries: number = 1
  ): Promise<AgenticOutputMessage[]> {
    return this.runWithRetry(messages, context, maxRetries, 1)
  }

  private async runWithRetry(
    messages: AgenticInputMessage[],
    context: Context,
    maxRetries: number,
    attempt: number
  ): Promise<AgenticOutputMessage[]> {
    try {
      const runner = new Runner({
        modelSettings: { temperature: 0 },
      })
      const result = await runner.run(this.agent, messages, { context })
      return result.finalOutput?.messages || []
    } catch (error) {
      if (attempt > maxRetries) {
        throw error
      }
      return this.runWithRetry(messages, context, maxRetries, attempt + 1)
    }
  }
}
