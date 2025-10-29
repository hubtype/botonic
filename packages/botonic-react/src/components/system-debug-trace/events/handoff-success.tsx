import { EventAction } from '@botonic/core'
import React from 'react'

import { HeadSetSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface HandoffSuccessDebugEvent {
  action: EventAction.HandoffSuccess
  queue_name: string
  is_queue_open: boolean
}

export const HandoffSuccess = (props: HandoffSuccessDebugEvent) => {
  return (
    <StyledDebugDetail>
      <StyledDebugLabel>{LABELS.QUEUE}</StyledDebugLabel>
      <StyledDebugValue>{props.queue_name}</StyledDebugValue>
    </StyledDebugDetail>
  )
}

export const getHandoffSuccessEventConfig = (
  data: HandoffSuccessDebugEvent
): DebugEventConfig => {
  return {
    action: EventAction.HandoffSuccess,
    title: (
      <>
        Handoff to agent <span>- {data.queue_name}</span>
      </>
    ),
    component: HandoffSuccess,
    icon: <HeadSetSvg />,
    collapsible: true,
  }
}
