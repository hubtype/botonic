import { EventAction } from '@botonic/core'
import React from 'react'

import { WandSvg } from '../icons/wand'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'

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
  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>Query</StyledDebugLabel>{' '}
        <StyledDebugValue>{props.user_input}</StyledDebugValue>
      </StyledDebugDetail>
      {props.knowledgebase_fail_reason ? (
        <StyledDebugDetail>
          <StyledDebugLabel>Knowledge Base Fail Reason:</StyledDebugLabel>{' '}
          <StyledDebugValue>{props.knowledgebase_fail_reason}</StyledDebugValue>
        </StyledDebugDetail>
      ) : (
        <>
          <StyledDebugDetail>
            <StyledDebugLabel>Sources IDs</StyledDebugLabel>
            {props.knowledgebase_sources_ids.map(source => (
              <StyledDebugValue key={source}>{source}</StyledDebugValue>
            ))}
          </StyledDebugDetail>
          <StyledDebugDetail>
            <StyledDebugLabel>Chunks IDs</StyledDebugLabel>
            {props.knowledgebase_chunks_ids.map(chunk => (
              <StyledDebugValue key={chunk}>{chunk}</StyledDebugValue>
            ))}
          </StyledDebugDetail>
        </>
      )}
    </>
  )
}

export const knowledgeBaseEventConfig = {
  action: EventAction.Knowledgebase,
  title: 'Knowledge base triggered',
  component: KnowledgeBase,
  icon: <WandSvg color={'#666A7A'} />,
}
