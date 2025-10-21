import { EventAction } from '@botonic/core'
import React from 'react'

import { LifeRingSvg } from '../icons/life-ring'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'

export interface FallbackDebugEvent {
  action: EventAction.Fallback
  user_input: string
  fallback_out: number
  fallback_message_id: string
}

export const Fallback = (props: FallbackDebugEvent) => {
  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>Fallback out</StyledDebugLabel>
        <StyledDebugValue>{props.fallback_out}</StyledDebugValue>
      </StyledDebugDetail>
    </>
  )
}

export const fallbackEventConfig = {
  action: EventAction.Fallback,
  title: 'Fallback triggered',
  component: Fallback,
  icon: <LifeRingSvg color={'#666A7A'} />,
}
