import { EventAction } from '@botonic/core'
import React from 'react'

import { useKnowledgeSources } from '../hooks/use-knowledge-sources'
import { CircleCheckSvg, WandSvg } from '../icons'
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
  knowledge_base_sources?: any[]
  knowledge_base_chunks?: any[]
  messageId?: string
}

export const KnowledgeBase = (props: KnowledgeBaseDebugEvent) => {
  const { sources, chunks, getIconForSourceType } = useKnowledgeSources({
    sourceIds: props.knowledgebase_sources_ids,
    chunkIds: props.knowledgebase_chunks_ids,
    messageId: props.messageId,
    existingSources: props.knowledge_base_sources,
    existingChunks: props.knowledge_base_chunks,
  })

  // Infer states from knowledgebase_fail_reason
  const hasKnowledge =
    !props.knowledgebase_fail_reason ||
    props.knowledgebase_fail_reason === 'hallucination'
  const isFaithful =
    !props.knowledgebase_fail_reason || props.knowledgebase_fail_reason === ''
  const showFailReason =
    props.knowledgebase_fail_reason &&
    props.knowledgebase_fail_reason !== 'hallucination'

  const handleSeeChunks = () => {
    window.dispatchEvent(
      new CustomEvent('see-chunks-clicked', {
        detail: {
          messageId: props.messageId,
          chunks,
          sources,
        },
      })
    )
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
                <StyledSeeChunksButton onClick={handleSeeChunks}>
                  See chunks
                </StyledSeeChunksButton>
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
