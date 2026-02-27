import type {
  OutputMessage,
  ResolvedPlugins,
  ToolExecution,
} from '@botonic/core'
import {
  InputGuardrailTripwireTriggered,
  Runner,
  RunToolCallItem,
  RunToolCallOutputItem,
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
    const toolResultsByCallId = this.getToolResultsByCallId(result.newItems)

    return (
      result.newItems
        ?.filter(item => item instanceof RunToolCallItem)
        .map((item: RunToolCallItem) =>
          this.getToolExecutionInfo(
            item as RunToolCallItem,
            context,
            toolResultsByCallId
          )
        )
        .filter(
          (toolExecution: ToolExecution) => toolExecution.toolName !== ''
        ) || []
    )
  }

  private getToolResultsByCallId(newItems: unknown[]): Map<string, string> {
    const map = new Map<string, string>()
    for (const item of newItems || []) {
      if (!(item instanceof RunToolCallOutputItem)) {
        continue
      }
      const rawItem = item.rawItem as {
        callId?: string
        output?: string | { type?: string; text?: string }
      }
      const callId = rawItem?.callId
      const output = rawItem?.output
      if (callId == null || output == null) {
        continue
      }
      const text = this.extractToolResult(output)
      if (text != null) {
        map.set(callId, text)
      }
    }
    return map
  }

  private extractToolResult(
    output: string | { type?: string; text?: string }
  ): string | undefined {
    if (typeof output === 'string') {
      return output
    }
    return output?.type === 'text' && typeof output?.text === 'string'
      ? output.text
      : undefined
  }

  private getToolExecutionInfo(
    item: RunToolCallItem,
    context: Context<TPlugins, TExtraData>,
    toolResultsByCallId: Map<string, string>
  ): ToolExecution {
    if (item.rawItem.type !== 'function_call') {
      return {
        toolName: '',
        toolArguments: {},
      }
    }
    const toolName = item.rawItem.name
    const toolArguments = this.getSafeToolArguments(item.rawItem.arguments)
    const toolResults = item.rawItem.callId
      ? toolResultsByCallId.get(item.rawItem.callId)
      : undefined

    const toolExecution: ToolExecution = {
      toolName,
      toolArguments,
      toolResults,
    }

    if (toolName === retrieveKnowledge.name) {
      return {
        ...toolExecution,
        knowledgebaseSourcesIds: context.knowledgeUsed.sourceIds,
        knowledgebaseChunksIds: context.knowledgeUsed.chunksIds,
      }
    }

    return toolExecution
  }

  private getSafeToolArguments(rawToolArguments: string): Record<string, any> {
    try {
      return JSON.parse(rawToolArguments)
    } catch (_error) {
      return {}
    }
  }
}
