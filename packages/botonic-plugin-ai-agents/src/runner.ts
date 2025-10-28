import { ResolvedPlugins, ToolExecution } from '@botonic/core'
import {
  InputGuardrailTripwireTriggered,
  Runner,
  RunToolCallItem,
} from '@openai/agents'

import { retrieveKnowledge } from './tools'
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
    context: Context<TPlugins, TExtraData>,
    maxRetries: number = 1
  ): Promise<RunResult> {
    return this.runWithRetry(messages, context, maxRetries, 1)
  }

  private async runWithRetry(
    inputMessages: AgenticInputMessage[],
    context: Context<TPlugins, TExtraData>,
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
      const toolsExecuted = this.getToolsExecuted(result, context)

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
      if (attempt > maxRetries) {
        throw error
      }
      return this.runWithRetry(inputMessages, context, maxRetries, attempt + 1)
    }
  }

  private getToolsExecuted(
    result,
    context: Context<TPlugins, TExtraData>
  ): ToolExecution[] {
    return (
      result.newItems
        ?.filter(item => item instanceof RunToolCallItem)
        .map((item: RunToolCallItem) =>
          this.getToolExecutionInfo(item as RunToolCallItem, context)
        )
        .filter(
          (toolExecution: ToolExecution) => toolExecution.toolName !== ''
        ) || []
    )
  }

  private getToolExecutionInfo(
    item: RunToolCallItem,
    context: Context<TPlugins, TExtraData>
  ): ToolExecution {
    if (item.rawItem.type !== 'function_call') {
      return {
        toolName: '',
        toolArguments: {},
      }
    }
    const toolName = item.rawItem.name
    const toolArguments = this.getSafeToolArguments(item.rawItem.arguments)

    if (toolName === retrieveKnowledge.name) {
      return {
        toolName,
        toolArguments,
        knowledgebaseSourcesIds: context.knowledgeUsed.sourceIds,
        knowledgebaseChunksIds: context.knowledgeUsed.chunksIds,
      }
    }

    return {
      toolName,
      toolArguments,
    }
  }

  private getSafeToolArguments(rawToolArguments: string): Record<string, any> {
    try {
      return JSON.parse(rawToolArguments)
    } catch (error) {
      return {}
    }
  }
}
