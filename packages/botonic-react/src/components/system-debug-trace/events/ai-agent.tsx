import { EventAction } from '@botonic/core'
import React, { useEffect, useState } from 'react'

import {
  DebugHubtypeApiService,
  HubtypeChunk,
  HubtypeSource,
} from '../api-service'
import {
  FilePdfSvg,
  FileWordSvg,
  HandSvg,
  LinkSvg,
  ScrewdriverWrenchSvg,
  WandSvg,
} from '../icons'
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
}

export const AiAgent = (props: AiAgentDebugEvent) => {
  const debugHubtypeApiService = new DebugHubtypeApiService()
  // Collect all sources, chunks, and query from all tools
  const [allSources, setAllSources] = useState<HubtypeSource[]>([])
  const allSourcesIds: string[] = []
  const [allChunks, setAllChunks] = useState<HubtypeChunk[]>([])
  const allChunksIds: string[] = []
  let query: string | undefined

  const fetchSources = async () => {
    const sources = await debugHubtypeApiService.getSourcesByIds(allSourcesIds)
    setAllSources(sources)
  }
  const fetchChunks = async () => {
    const chunks = await debugHubtypeApiService.getChunksByIds(allChunksIds)
    setAllChunks(chunks)
  }

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

  useEffect(() => {
    fetchSources()
    fetchChunks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getIconForSourceType = (source: HubtypeSource) => {
    switch (source.type) {
      case 'file':
        if (source.active_extraction_job.file_name.endsWith('.pdf')) {
          return <FilePdfSvg />
        } else {
          return <FileWordSvg />
        }
      case 'url':
        return <LinkSvg />
      default:
        return null
    }
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
            <StyledSeeChunksButton>See chunks</StyledSeeChunksButton>
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
