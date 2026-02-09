import type {
  OutputMessage,
  ResolvedPlugins,
  ToolExecution,
} from '@botonic/core'
import {
  InputGuardrailTripwireTriggered,
  Runner,
  RunToolCallItem,
} from '@openai/agents'

import type { DebugLogger } from './debug-logger'
import { retrieveKnowledge } from './tools'
import type {
  AgenticInputMessage,
  AgenticOutputMessage,
  AIAgent,
  Context,
  RunResult,
} from './types'

// Minimal interface matching the properties we actually use from Runner.run() result
// This bypasses strict type checking while maintaining type safety for accessed properties
interface AIAgentRunnerResult {
  finalOutput?: {
    messages?: OutputMessage[]
  }
  newItems?: RunToolCallItem[]
}

export class AIAgentRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = any,
> {
  private agent: AIAgent<TPlugins, TExtraData>
  private logger: DebugLogger

  constructor(agent: AIAgent<TPlugins, TExtraData>, logger: DebugLogger) {
    this.agent = agent
    this.logger = logger
  }

  async run(
    messages: AgenticInputMessage[],
    context: Context<TPlugins, TExtraData>
  ): Promise<RunResult> {
    const startTime = Date.now()

    this.logger.logRunnerStart()

    try {
      const runner = new Runner({
        modelSettings: { temperature: 0 },
      })
      // Type assertion to bypass strict type checking - the actual return type from runner.run()
      // doesn't perfectly match our interface, but the properties we access are compatible
      const result = (await runner.run(this.agent, messages, {
        context,
      })) as AIAgentRunnerResult

      const outputMessages = result.finalOutput?.messages || []
      const hasExit =
        outputMessages.length === 0 ||
        outputMessages.some(message => message.type === 'exit')
      const toolsExecuted = this.getToolsExecuted(result, context)

      const runResult: RunResult = {
        messages: hasExit
          ? []
          : (outputMessages.filter(
              message => message.type !== 'exit'
            ) as AgenticOutputMessage[]),
        toolsExecuted,
        exit: hasExit,
        memoryLength: messages.length,
        error: false,
        inputGuardrailsTriggered: [],
        outputGuardrailsTriggered: [],
      }

      this.logger.logRunResult(runResult, startTime)

      return runResult
    } catch (error) {
      if (error instanceof InputGuardrailTripwireTriggered) {
        const runResult: RunResult = {
          messages: [],
          memoryLength: 0,
          toolsExecuted: [],
          exit: true,
          error: false,
          inputGuardrailsTriggered: error.result.output.outputInfo,
          outputGuardrailsTriggered: [],
        }

        this.logger.logGuardrailTriggered()
        this.logger.logRunResult(runResult, startTime)

        return runResult
      }

      this.logger.logRunnerError(startTime, error)

      throw error
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
    } catch (_error) {
      return {}
    }
  }
}
