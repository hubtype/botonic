import { EventAction } from '@botonic/core'
import React, { useMemo } from 'react'

import { useKnowledgeSources } from '../hooks/use-knowledge-sources'
import { HandSvg, ScrewdriverWrenchSvg, WandSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledDebugValue,
  StyledGuardrailItem,
  StyledSeeChunksButton,
} from '../styles'
import { DebugEventConfig } from '../types'

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
  knowledge_base_sources?: any[]
  knowledge_base_chunks?: any[]
  messageId?: string
}

export const AiAgent = (props: AiAgentDebugEvent) => {
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
  } = useKnowledgeSources({
    sourceIds: allSourcesIds,
    chunkIds: allChunksIds,
    messageId: props.messageId,
    existingSources: props.knowledge_base_sources,
    existingChunks: props.knowledge_base_chunks,
  })

  const handleSeeChunks = () => {
    window.dispatchEvent(
      new CustomEvent('see-chunks-clicked', {
        detail: {
          messageId: props.messageId,
          chunks: allChunks,
          sources: allSources,
        },
      })
    )
  }
  return (
    <>
      {query && (
        <StyledDebugDetail>
          <StyledDebugLabel>Query</StyledDebugLabel>
          <StyledDebugValue>&quot;{query}&quot;</StyledDebugValue>
        </StyledDebugDetail>
      )}

      {allSources.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>Knowledge gathered</StyledDebugLabel>
          {allSources.map((source, index) => (
            <StyledDebugItemWithIcon key={index}>
              {getIconForSourceType(source)}
              <span className='value'>
                {source.active_extraction_job.file_name}
              </span>
            </StyledDebugItemWithIcon>
          ))}
          {allChunks.length > 0 && (
            <StyledSeeChunksButton onClick={handleSeeChunks}>
              See chunks
            </StyledSeeChunksButton>
          )}
        </StyledDebugDetail>
      )}

      {props.tools_executed.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>Executed tools</StyledDebugLabel>
          {props.tools_executed.map((tool, index) => (
            <StyledDebugItemWithIcon key={`${tool.tool_name}-${index}`}>
              <ScrewdriverWrenchSvg />
              {tool.tool_name}
            </StyledDebugItemWithIcon>
          ))}
        </StyledDebugDetail>
      )}

      {props.input_guardrails_triggered.map((guardrail, index) => (
        <StyledGuardrailItem key={`input-${index}`}>
          <HandSvg />
          <span className='label'>Guardrail triggered</span>
          <span className='value'>- {guardrail}</span>
        </StyledGuardrailItem>
      ))}
      {props.output_guardrails_triggered.map((guardrail, index) => (
        <StyledGuardrailItem key={`output-${index}`}>
          <HandSvg />
          <span className='label'>Guardrail triggered</span>
          <span className='value'>- {guardrail}</span>
        </StyledGuardrailItem>
      ))}

      {props.exit && (
        <StyledDebugDetail>
          <StyledDebugLabel>Exit</StyledDebugLabel>
        </StyledDebugDetail>
      )}

      {props.error && (
        <StyledDebugDetail>
          <StyledDebugLabel>Error</StyledDebugLabel>
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
