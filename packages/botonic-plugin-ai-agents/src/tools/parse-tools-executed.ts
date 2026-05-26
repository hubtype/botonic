import type { ResolvedPlugins, ToolExecution } from '@botonic/core'
import { RunToolCallItem, RunToolCallOutputItem } from '@openai/agents'
import type { Context } from '../types'
import { RETRIEVE_KNOWLEDGE_TOOL_NAME } from '.'

export function parseToolsExecuted<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
>(
  newItems: unknown[],
  context: Context<TPlugins, TExtraData>
): ToolExecution[] {
  const toolResultsByCallId = getToolResultsByCallId(newItems)

  return newItems
    .filter(item => item instanceof RunToolCallItem)
    .map(item =>
      getToolExecutionInfo(
        item as RunToolCallItem,
        context,
        toolResultsByCallId
      )
    )
    .filter(toolExecution => toolExecution.toolName !== '')
}

function getToolResultsByCallId(newItems: unknown[]): Map<string, string> {
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
    const text = extractToolResult(output)
    if (text != null) {
      map.set(callId, text)
    }
  }
  return map
}

function extractToolResult(
  output: string | { type?: string; text?: string }
): string | undefined {
  if (typeof output === 'string') {
    return output
  }
  return output?.type === 'text' && typeof output?.text === 'string'
    ? output.text
    : undefined
}

function getToolExecutionInfo<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
>(
  item: RunToolCallItem,
  context: Context<TPlugins, TExtraData>,
  toolResultsByCallId: Map<string, string>
): ToolExecution {
  if (item.rawItem.type !== 'function_call') {
    return { toolName: '', toolArguments: {} }
  }
  const toolName = item.rawItem.name
  const toolArguments = getSafeToolArguments(item.rawItem.arguments)
  const toolResults = item.rawItem.callId
    ? toolResultsByCallId.get(item.rawItem.callId)
    : undefined

  const toolExecution: ToolExecution = { toolName, toolArguments, toolResults }

  if (toolName === RETRIEVE_KNOWLEDGE_TOOL_NAME) {
    return {
      ...toolExecution,
      knowledgebaseSourcesIds: context.knowledgeUsed.sourceIds,
      knowledgebaseChunksIds: context.knowledgeUsed.chunksIds,
    }
  }

  return toolExecution
}

function getSafeToolArguments(
  rawToolArguments: string
): Record<string, unknown> {
  try {
    return JSON.parse(rawToolArguments)
  } catch {
    return {}
  }
}
