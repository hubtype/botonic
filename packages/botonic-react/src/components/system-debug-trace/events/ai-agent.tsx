import { EventAction } from '@botonic/core'
import React, { useMemo } from 'react'

import { HubtypeChunk, HubtypeSource } from '../api-service'
import { useKnowledgeBaseInfo } from '../hooks/use-knowledge-base-info'
import { ScrewdriverWrenchSvg, WandSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledDebugValue,
  StyledSeeChunksButton,
  StyledSourceValue,
} from '../styles'
import { DebugEventConfig } from '../types'
import { GuardrailList } from './components'
import { LABELS } from './constants'
import { useChunksModal } from './hooks'

interface ToolExecuted {
  tool_name: string
  tool_arguments: Record<string, unknown>
  knowledgebase_sources_ids?: string[]
  knowledgebase_chunks_ids?: string[]
}

export interface AiAgentDebugEvent {
  action: EventAction.AiAgent
  flow_node_content_id: string
  user_input?: string
  tools_executed: ToolExecuted[]
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  error: boolean
  knowledge_base_sources?: HubtypeSource[]
  knowledge_base_chunks?: HubtypeChunk[]
  messageId?: string
}

export const AiAgent = (props: AiAgentDebugEvent) => {
  const { openChunksModal } = useChunksModal()

  // Collect all sources, chunks, and query from all tools
  const { allSourcesIds, allChunksIds, query } = useMemo(() => {
    const allSourcesIds: string[] = []
    const allChunksIds: string[] = []
    let query: string | undefined

    props.tools_executed.forEach(tool => {
      if (
        tool.tool_arguments?.query &&
        typeof tool.tool_arguments.query === 'string'
      ) {
        query = tool.tool_arguments.query
      }
      if (tool.knowledgebase_sources_ids) {
        allSourcesIds.push(...tool.knowledgebase_sources_ids)
      }
      if (tool.knowledgebase_chunks_ids) {
        allChunksIds.push(...tool.knowledgebase_chunks_ids)
      }
    })

    return { allSourcesIds, allChunksIds, query }
  }, [props.tools_executed])

  const {
    sources: allSources,
    chunks: allChunks,
    getIconForSourceType,
  } = useKnowledgeBaseInfo({
    sourceIds: allSourcesIds,
    chunkIds: allChunksIds,
    messageId: props.messageId,
    existingSources: props.knowledge_base_sources,
    existingChunks: props.knowledge_base_chunks,
  })

  const handleSeeChunks = () => {
    openChunksModal({
      messageId: props.messageId,
      chunks: allChunks,
      sources: allSources,
    })
  }
  return (
    <>
      {query && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.QUERY}</StyledDebugLabel>
          <StyledDebugValue>&quot;{query}&quot;</StyledDebugValue>
        </StyledDebugDetail>
      )}

      {allSources.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.KNOWLEDGE_GATHERED}</StyledDebugLabel>
          {allSources.map(source => (
            <StyledDebugItemWithIcon key={source.id}>
              {getIconForSourceType(source)}
              <StyledSourceValue>
                {source.active_extraction_job.file_name}
              </StyledSourceValue>
            </StyledDebugItemWithIcon>
          ))}
          {allChunks.length > 0 && (
            <StyledSeeChunksButton onClick={handleSeeChunks}>
              {LABELS.SEE_CHUNKS_BUTTON}
            </StyledSeeChunksButton>
          )}
        </StyledDebugDetail>
      )}

      {props.tools_executed.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.EXECUTED_TOOLS}</StyledDebugLabel>
          {props.tools_executed.map((tool, index) => (
            <StyledDebugItemWithIcon key={`${tool.tool_name}-${index}`}>
              <ScrewdriverWrenchSvg />
              {tool.tool_name}
            </StyledDebugItemWithIcon>
          ))}
        </StyledDebugDetail>
      )}

      <GuardrailList
        keyPrefix='input'
        guardrails={props.input_guardrails_triggered}
      />
      <GuardrailList
        keyPrefix='output'
        guardrails={props.output_guardrails_triggered}
        $isLastItem={!props.exit && !props.error}
      />

      {props.exit && (
        <StyledDebugDetail $isLastItem={props.exit && !props.error}>
          <StyledDebugLabel>{LABELS.EXIT}</StyledDebugLabel>
        </StyledDebugDetail>
      )}

      {props.error && (
        <StyledDebugDetail $isLastItem={props.exit && props.error}>
          <StyledDebugLabel>{LABELS.ERROR}</StyledDebugLabel>
        </StyledDebugDetail>
      )}
    </>
  )
}

export const getAiAgentEventConfig = (
  data: AiAgentDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      AI Agent triggered <span>- {data.flow_node_content_id}</span>
    </>
  )

  return {
    action: EventAction.AiAgent,
    title,
    component: AiAgent,
    icon: <WandSvg />,
    collapsible: true,
  }
}
