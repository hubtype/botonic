import { EventAction } from '@botonic/core'
import React from 'react'

import { HeadSetSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import { DebugEventConfig } from '../types'

export interface HandoffSuccessDebugEvent {
  action: EventAction.HandoffSuccess
  queue_name: string
  is_queue_open: boolean
}

export const HandoffSuccess = (props: HandoffSuccessDebugEvent) => {
  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>Queue Name</StyledDebugLabel>
        <StyledDebugValue>{props.queue_name}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>Is Queue Open</StyledDebugLabel>
        <StyledDebugValue>
          {props.is_queue_open ? 'Yes' : 'No'}
        </StyledDebugValue>
      </StyledDebugDetail>
    </>
  )
}

export const getHandoffSuccessEventConfig = (
  data: HandoffSuccessDebugEvent
): DebugEventConfig => {
  return {
    action: EventAction.HandoffSuccess,
    title: (
      <>
        Handoff success <span>- {data.queue_name}</span>
      </>
    ),
    component: null,
    icon: <HeadSetSvg />,
    collapsible: false,
  }
}
