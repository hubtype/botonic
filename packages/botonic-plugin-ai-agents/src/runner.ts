import { ResolvedPlugins } from '@botonic/core'
import {
  InputGuardrailTripwireTriggered,
  OutputGuardrailTripwireTriggered,
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

export class AIAgentRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private agent: AIAgent<TPlugins, TExtraData>

  constructor(agent: AIAgent<TPlugins, TExtraData>) {
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
    inputMessages: AgenticInputMessage[],
    context: Context,
    maxRetries: number,
    attempt: number
  ): Promise<RunResult> {
    try {
      const runner = new Runner({
        modelSettings: { temperature: 0 },
      })
      const result = await runner.run(this.agent, inputMessages, { context })

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
        memoryLength: inputMessages.length,
        error: false,
        inputGuardrailsTriggered: [],
        outputGuardrailsTriggered: [],
      }
    } catch (error) {
      if (error instanceof InputGuardrailTripwireTriggered) {
        return {
          messages: [],
          memoryLength: 0,
          toolsExecuted: [],
          exit: true,
          error: false,
          inputGuardrailsTriggered: error.result.output.outputInfo,
          outputGuardrailsTriggered: [],
        }
      }
      if (error instanceof OutputGuardrailTripwireTriggered) {
        return {
          messages: [],
          memoryLength: 0,
          toolsExecuted: [],
          exit: true,
          error: false,
          inputGuardrailsTriggered: [],
          outputGuardrailsTriggered: error.result.output.outputInfo,
        }
      }
      if (attempt > maxRetries) {
        throw error
      }
      return this.runWithRetry(inputMessages, context, maxRetries, attempt + 1)
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
