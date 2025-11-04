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
  handoff_queue_name: string
  handoff_is_queue_open: boolean
}

export const HandoffSuccess = (props: HandoffSuccessDebugEvent) => {
  return (
    <StyledDebugDetail>
      <StyledDebugLabel>{LABELS.QUEUE}</StyledDebugLabel>
      <StyledDebugValue>{props.handoff_queue_name}</StyledDebugValue>
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
        Handoff to agent <span>- {data.handoff_queue_name}</span>
      </>
    ),
    component: HandoffSuccess,
    icon: <HeadSetSvg />,
    collapsible: true,
  }
}
