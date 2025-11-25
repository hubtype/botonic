import { EventAction } from '@botonic/core'
import React from 'react'

import { SplitSvg } from '../icons/split'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface ConditionalQueueStatusDebugEvent {
  action: EventAction.ConditionalQueueStatus
  queue_id: string
  queue_name: string
  is_queue_open: boolean
  is_available_agent: boolean
}

export const ConditionalQueueStatus = (
  props: ConditionalQueueStatusDebugEvent
) => {
  const queueStatus = props.is_queue_open ? LABELS.OPEN : LABELS.CLOSED
  const agentStatus = props.is_available_agent ? LABELS.YES : LABELS.NO

  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.QUEUE}</StyledDebugLabel>
        <StyledDebugValue>{props.queue_name}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.STATUS}</StyledDebugLabel>
        <StyledDebugValue>{queueStatus}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.AGENTS_AVAILABLE}</StyledDebugLabel>
        <StyledDebugValue>{agentStatus}</StyledDebugValue>
      </StyledDebugDetail>
    </>
  )
}

export const getConditionalQueueStatusEventConfig = (
  data: ConditionalQueueStatusDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Queue status checked <span>- {data.queue_name}</span>
    </>
  )

  return {
    action: EventAction.ConditionalQueueStatus,
    title,
    component: ConditionalQueueStatus,
    icon: <SplitSvg />,
    collapsible: true,
  }
}
