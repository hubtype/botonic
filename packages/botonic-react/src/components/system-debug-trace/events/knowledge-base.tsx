import { EventAction } from '@botonic/core'
import React, { useContext } from 'react'

import { WebchatContext } from '../../../webchat/context'
import { useKnowledgeBaseInfo } from '../hooks/use-knowledge-base-info'
import { CircleCheckSvg, WandSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
  StyledGuardrailItem,
  StyledGuardrailLabel,
} from '../styles'
import { DebugEventConfig } from '../types'
import { SourcesSection } from './components'
import { LABELS } from './constants'

export interface KnowledgeBaseDebugEvent {
  action: EventAction.Knowledgebase
  flow_id: string
  flow_node_id: string
  knowledgebase_inference_id: string
  knowledgebase_fail_reason: string
  knowledgebase_sources_ids: string[]
  knowledgebase_chunks_ids: string[]
  user_input: string
  knowledge_base_chunks_with_sources?: import('../../../index-types').ChunkIdsGroupedBySourceData[]
  messageId?: string
}

export const KnowledgeBase = (props: KnowledgeBaseDebugEvent) => {
  const { previewUtils } = useContext(WebchatContext)
  const {
    sources,
    chunks,
    chunksWithSources,
    getIconForSourceType,
    hasKnowledge,
    isFaithful,
  } = useKnowledgeBaseInfo({
    sourceIds: props.knowledgebase_sources_ids,
    chunkIds: props.knowledgebase_chunks_ids,
    messageId: props.messageId,
    existingChunksWithSources: props.knowledge_base_chunks_with_sources,
    failReason: props.knowledgebase_fail_reason,
  })

  const showFailReason = !hasKnowledge || !isFaithful

  const handleSeeChunks = () => {
    if (previewUtils?.onClickOpenChunks) {
      previewUtils.onClickOpenChunks(chunksWithSources)
    }
  }

  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.QUERY}</StyledDebugLabel>
        <StyledDebugValue>&quot;{props.user_input}&quot;</StyledDebugValue>
      </StyledDebugDetail>

      {showFailReason ? (
        <StyledDebugDetail>
          <StyledDebugLabel>
            {LABELS.KNOWLEDGE_BASE_FAIL_REASON}
          </StyledDebugLabel>
          <StyledDebugValue>{props.knowledgebase_fail_reason}</StyledDebugValue>
        </StyledDebugDetail>
      ) : (
        <>
          <SourcesSection
            sources={sources}
            chunks={chunks}
            getIconForSourceType={getIconForSourceType}
            onSeeChunks={handleSeeChunks}
          />

          {hasKnowledge && (
            <StyledGuardrailItem>
              <CircleCheckSvg />
              <StyledGuardrailLabel>
                {LABELS.KNOWLEDGE_FOUND}
              </StyledGuardrailLabel>
            </StyledGuardrailItem>
          )}

          {isFaithful && (
            <StyledGuardrailItem $isLastItem={true}>
              <CircleCheckSvg />
              <StyledGuardrailLabel>
                {LABELS.FAITHFUL_ANSWER}
              </StyledGuardrailLabel>
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
