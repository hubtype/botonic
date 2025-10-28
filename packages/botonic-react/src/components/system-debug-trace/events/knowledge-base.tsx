import { EventAction } from '@botonic/core'
import React, { useEffect, useState } from 'react'

import {
  DebugHubtypeApiService,
  HubtypeChunk,
  HubtypeSource,
} from '../api-service'
import {
  CircleCheckSvg,
  FilePdfSvg,
  FileWordSvg,
  LinkSvg,
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

export interface KnowledgeBaseDebugEvent {
  action: EventAction.Knowledgebase
  flow_id: string
  flow_node_id: string
  knowledgebase_inference_id: string
  knowledgebase_fail_reason: string
  knowledgebase_sources_ids: string[]
  knowledgebase_chunks_ids: string[]
  user_input: string
}

export const KnowledgeBase = (props: KnowledgeBaseDebugEvent) => {
  const debugHubtypeApiService = new DebugHubtypeApiService()
  const [sources, setSources] = useState<HubtypeSource[]>([])
  const [chunks, setChunks] = useState<HubtypeChunk[]>([])

  // Infer states from knowledgebase_fail_reason
  const hasKnowledge =
    !props.knowledgebase_fail_reason ||
    props.knowledgebase_fail_reason === 'hallucination'
  const isFaithful =
    !props.knowledgebase_fail_reason || props.knowledgebase_fail_reason === ''
  const showFailReason =
    props.knowledgebase_fail_reason &&
    props.knowledgebase_fail_reason !== 'hallucination'

  const fetchSources = async () => {
    const fetchedSources = await debugHubtypeApiService.getSourcesByIds(
      props.knowledgebase_sources_ids
    )
    setSources(fetchedSources)
  }

  const fetchChunks = async () => {
    const fetchedChunks = await debugHubtypeApiService.getChunksByIds(
      props.knowledgebase_chunks_ids
    )
    setChunks(fetchedChunks)
  }

  useEffect(() => {
    if (props.knowledgebase_sources_ids.length > 0) {
      fetchSources()
    }
    if (props.knowledgebase_chunks_ids.length > 0) {
      fetchChunks()
    }
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
      <StyledDebugDetail>
        <StyledDebugLabel>Query</StyledDebugLabel>
        <StyledDebugValue>&quot;{props.user_input}&quot;</StyledDebugValue>
      </StyledDebugDetail>

      {showFailReason ? (
        <StyledDebugDetail>
          <StyledDebugLabel>Knowledge Base Fail Reason</StyledDebugLabel>
          <StyledDebugValue>{props.knowledgebase_fail_reason}</StyledDebugValue>
        </StyledDebugDetail>
      ) : (
        <>
          {sources.length > 0 && (
            <StyledDebugDetail>
              <StyledDebugLabel>Sources</StyledDebugLabel>
              {sources.map((source, index) => (
                <StyledDebugItemWithIcon key={index}>
                  {getIconForSourceType(source)}
                  <span className='value'>
                    {source.active_extraction_job.file_name}
                  </span>
                </StyledDebugItemWithIcon>
              ))}
              {chunks.length > 0 && (
                <StyledSeeChunksButton>See chunks</StyledSeeChunksButton>
              )}
            </StyledDebugDetail>
          )}

          {hasKnowledge && (
            <StyledGuardrailItem>
              <CircleCheckSvg />
              <span className='label'>Knowledge found</span>
            </StyledGuardrailItem>
          )}

          {isFaithful && (
            <StyledGuardrailItem>
              <CircleCheckSvg />
              <span className='label'>Faithful answer</span>
            </StyledGuardrailItem>
          )}
        </>
      )}
    </>
  )
}

export const getKnowledgeBaseEventConfig = (
  _data: KnowledgeBaseDebugEvent
): DebugEventConfig => {
  const title = <>Knowledge Base triggered</>

  return {
    action: EventAction.Knowledgebase,
    title,
    component: KnowledgeBase,
    icon: <WandSvg />,
    collapsible: true,
  }
}
