import type { ResolvedPlugins, ToolExecution } from '@botonic/core'
import { RunToolCallItem, RunToolCallOutputItem } from '@openai/agents'
import { RETRIEVE_KNOWLEDGE_TOOL_NAME } from '../tools'
import type { Context } from '../types'
import { BaseRunner, type RunnerResult } from './base-runner'

export class WorkerRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> extends BaseRunner<TPlugins, TExtraData> {
  protected getToolsExecuted(
    result: RunnerResult,
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

  private getToolResultsByCallId(
    newItems: unknown[] = []
  ): Map<string, string> {
    const map = new Map<string, string>()
    for (const item of newItems) {
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

    if (toolName === RETRIEVE_KNOWLEDGE_TOOL_NAME) {
      return {
        ...toolExecution,
        knowledgebaseSourcesIds: context.knowledgeUsed.sourceIds,
        knowledgebaseChunksIds: context.knowledgeUsed.chunksIds,
      }
    }

    return toolExecution
  }

  private getSafeToolArguments(
    rawToolArguments: string
  ): Record<string, unknown> {
    try {
      return JSON.parse(rawToolArguments)
    } catch (_error) {
      return {}
    }
  }
}
