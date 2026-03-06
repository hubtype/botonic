import { EventAction } from '@botonic/core'
import { useContext, useMemo } from 'react'

import { WebchatContext } from '../../../webchat/context'
import { useKnowledgeBaseInfo } from '../hooks/use-knowledge-base-info'
import { ScrewdriverWrenchSvg, WandSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import type { DebugEventConfig } from '../types'
import { GuardrailList, SourcesSection } from './components'
import { LABELS } from './constants'
import type { ChunkIdsGroupedBySourceData } from './knowledge-bases-types'

interface ToolExecuted {
  tool_name: string
  tool_arguments: Record<string, unknown>
  tool_results?: string
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
  knowledge_base_chunks_with_sources?: ChunkIdsGroupedBySourceData[]
  messageId?: string
}

const RETRIEVE_KNOWLEDGE_TOOL = 'retrieve_knowledge'

function partitionTools(tools: ToolExecuted[]) {
  const retrieveKnowledgeTools: ToolExecuted[] = []
  const otherTools: ToolExecuted[] = []
  const allSourcesIds: string[] = []
  const allChunksIds: string[] = []
  let query: string | undefined

  for (const tool of tools) {
    if (tool.tool_name === RETRIEVE_KNOWLEDGE_TOOL) {
      retrieveKnowledgeTools.push(tool)
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
    } else {
      otherTools.push(tool)
    }
  }

  return {
    retrieveKnowledgeTools,
    otherTools,
    allSourcesIds,
    allChunksIds,
    query,
  }
}

export const AiAgent = (props: AiAgentDebugEvent) => {
  const { previewUtils } = useContext(WebchatContext)

  const {
    retrieveKnowledgeTools,
    otherTools,
    allSourcesIds,
    allChunksIds,
    query,
  } = useMemo(
    () => partitionTools(props.tools_executed),
    [props.tools_executed]
  )

  const {
    sources: allSources,
    chunks: allChunks,
    chunksWithSources,
    getIconForSourceType,
  } = useKnowledgeBaseInfo({
    sourceIds: allSourcesIds,
    chunkIds: allChunksIds,
    messageId: props.messageId,
    existingChunksWithSources: props.knowledge_base_chunks_with_sources,
  })

  const handleSeeChunks = () => {
    if (previewUtils?.onClickOpenChunks) {
      previewUtils.onClickOpenChunks(chunksWithSources)
    }
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

      {otherTools.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.EXECUTED_TOOLS}</StyledDebugLabel>
          {otherTools.map((tool, index) => (
            <StyledDebugItemWithIcon key={`${tool.tool_name}-${index}`}>
              <ScrewdriverWrenchSvg />
              {tool.tool_name}
            </StyledDebugItemWithIcon>
          ))}
        </StyledDebugDetail>
      )}

      {otherTools.length > 0 &&
        otherTools.map((tool, index) => (
          <StyledDebugDetail key={`${tool.tool_name}-${index}`}>
            <StyledDebugLabel>
              {tool.tool_name} – {LABELS.TOOL_ARGUMENTS}
            </StyledDebugLabel>
            <StyledDebugValue>
              {JSON.stringify(tool.tool_arguments ?? {}, null, 2)}
            </StyledDebugValue>
          </StyledDebugDetail>
        ))}

      {otherTools.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.TOOL_RESULTS}</StyledDebugLabel>
          {otherTools.map((tool, index) => (
            <StyledDebugValue key={`${tool.tool_name}-${index}`}>
              {tool.tool_results}
            </StyledDebugValue>
          ))}
        </StyledDebugDetail>
      )}

      {props.tools_executed.length === 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.NO_TOOLS_EXECUTED}</StyledDebugLabel>
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
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.EXIT}</StyledDebugLabel>
        </StyledDebugDetail>
      )}

      {props.error && (
        <StyledDebugDetail>
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
