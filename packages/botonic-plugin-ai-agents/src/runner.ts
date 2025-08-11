import {
  InputGuardrailTripwireTriggered,
  Runner,
  RunToolCallItem,
} from '@openai/agents'

import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AIAgent,
  Context,
  RunResult,
} from './types'

export class AIAgentRunner {
  private agent: AIAgent

  constructor(agent: AIAgent) {
    this.agent = agent
  }

  async run(
    messages: AgenticInputMessage[],
    context: Context,
    maxRetries: number = 1
  ): Promise<RunResult> {
    return this.runWithRetry(messages, context, maxRetries, 1)
  }

  private async runWithRetry(
    messages: AgenticInputMessage[],
    context: Context,
    maxRetries: number,
    attempt: number
  ): Promise<RunResult> {
    try {
      const runner = new Runner({
        modelSettings: { temperature: 0 },
      })
      const result = await runner.run(this.agent, messages, { context })

      const outputMessages = result.finalOutput?.messages || []
      const hasExit =
        outputMessages.length === 0 ||
        outputMessages.some(message => message.type === 'exit')
      const toolsExecuted = this.getExecutedNameTools(result)

      return {
        messages: hasExit
          ? []
          : (outputMessages.filter(
              message => message.type !== 'exit'
            ) as AgenticOutputMessage[]),
        toolsExecuted,
        exit: hasExit,
        inputGuardrailTriggered: [],
        outputGuardrailTriggered: [],
      }
    } catch (error) {
      if (error instanceof InputGuardrailTripwireTriggered) {
        return {
          messages: [],
          toolsExecuted: [],
          exit: true,
          inputGuardrailTriggered: error.result.output.outputInfo,
          outputGuardrailTriggered: [],
        }
      }
      if (attempt > maxRetries) {
        throw error
      }
      return this.runWithRetry(messages, context, maxRetries, attempt + 1)
    }
  }

  private getExecutedNameTools(result) {
    return (
      result.newItems
        ?.filter(item => item instanceof RunToolCallItem)
        .map((item: RunToolCallItem) => {
          if (item.rawItem.type === 'function_call') {
            return item.rawItem.name
          }
          return ''
        })
        .filter((toolName: string) => toolName !== '') || []
    )
  }
}
