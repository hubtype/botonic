import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import type { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface ConditionalCustomDebugEvent {
  action: EventAction.ConditionalCustom
  conditional_variable: string
  variable_format: string
  operator: string
}

export const ConditionalCustom = (props: ConditionalCustomDebugEvent) => {
  return (
    <>
      {props.operator && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.OPERATOR}</StyledDebugLabel>
          <StyledDebugValue>{props.operator}</StyledDebugValue>
        </StyledDebugDetail>
      )}
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.VALUE}</StyledDebugLabel>
        <StyledDebugValue>{props.conditional_variable}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.VARIABLE_FORMAT}</StyledDebugLabel>
        <StyledDebugValue>{props.variable_format}</StyledDebugValue>
      </StyledDebugDetail>
    </>
  )
}

export const getConditionalCustomEventConfig = (
  _data: ConditionalCustomDebugEvent
): DebugEventConfig => {
  const title = <>Custom condition resolved with:</>

  return {
    action: EventAction.ConditionalCustom,
    title,
    component: ConditionalCustom,
    icon: <SplitSvg />,
    collapsible: true,
  }
}
