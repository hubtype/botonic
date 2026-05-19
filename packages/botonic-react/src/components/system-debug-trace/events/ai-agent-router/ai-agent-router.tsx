import { EventAction, type ToolExecution } from '@botonic/core'
import { useContext, useMemo } from 'react'
import { WebchatContext } from '../../../../webchat/context'
import { useKnowledgeBaseInfo } from '../../hooks/use-knowledge-base-info'
import { SplitSvg } from '../../icons'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../../styles'
import type { DebugEventConfig } from '../../types'
import { GuardrailList, SourcesSection } from '../components'
import { LABELS } from '../constants'
import { ExecutedTools } from '../ai-agent/executed-tools'
import { parseTools } from '../ai-agent/parse-tools'
import type { AiAgentRouterDebugEvent, ToolExecuted } from './types'

export const AiAgentRouter = ({
  tools_executed,
  input_guardrails_triggered,
  output_guardrails_triggered,
  exit,
  messageId,
  knowledge_base_chunks_with_sources,
}: AiAgentRouterDebugEvent) => {
  const { previewUtils } = useContext(WebchatContext)

  const { otherTools, allSourcesIds, allChunksIds, query } = useMemo(
    () => parseTools(tools_executed),
    [tools_executed]
  )

  const {
    sources: allSources,
    chunks: allChunks,
    chunksWithSources,
    getIconForSourceType,
  } = useKnowledgeBaseInfo({
    sourceIds: allSourcesIds,
    chunkIds: allChunksIds,
    messageId,
    existingChunksWithSources: knowledge_base_chunks_with_sources,
  })

  const handleSeeChunks = () => {
    previewUtils?.onClickOpenChunks?.(chunksWithSources)
  }

  const handleSeeToolDetails = (tool: ToolExecuted) => {
    const toolExecution: ToolExecution = {
      toolName: tool.tool_name,
      toolArguments: tool.tool_arguments ?? {},
      toolResults: tool.tool_results ?? '',
    }

    previewUtils?.onClickOpenToolResults?.(toolExecution)
  }

  return (
    <>
      {query && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.QUERY}</StyledDebugLabel>
          <StyledDebugValue>&quot;{query}&quot;</StyledDebugValue>
        </StyledDebugDetail>
      )}

      <SourcesSection
        sources={allSources}
        chunks={allChunks}
        getIconForSourceType={getIconForSourceType}
        onSeeChunks={handleSeeChunks}
        label={LABELS.KNOWLEDGE_SOURCES}
      />

      <ExecutedTools
        tools={otherTools}
        onSeeToolDetails={handleSeeToolDetails}
      />

      {!tools_executed.length && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.NO_TOOLS_EXECUTED}</StyledDebugLabel>
        </StyledDebugDetail>
      )}

      <GuardrailList
        keyPrefix='input'
        guardrails={input_guardrails_triggered}
      />

      <GuardrailList
        keyPrefix='output'
        guardrails={output_guardrails_triggered}
        $isLastItem={!exit}
      />

      {exit && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.EXIT}</StyledDebugLabel>
        </StyledDebugDetail>
      )}
    </>
  )
}

export const getAiAgentRouterEventConfig = (
  data: AiAgentRouterDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      AI Agent Router <span>- {data.flow_node_content_id}</span>
    </>
  )

  return {
    action: EventAction.AiAgentRouter,
    title,
    component: AiAgentRouter,
    icon: <SplitSvg />,
    collapsible: true,
  }
}
