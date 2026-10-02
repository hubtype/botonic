import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import type { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface ConditionalContactReasonsDebugEvent {
  action: EventAction.ConditionalContactReasons
  contactReasons: string[]
  result: string
}

export const ConditionalContactReasons = (
  props: ConditionalContactReasonsDebugEvent
) => {
  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.CONTACT_REASONS}</StyledDebugLabel>
        <StyledDebugValue>{props.contactReasons.join(', ')}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.TARGET}</StyledDebugLabel>
        <StyledDebugValue>{props.result}</StyledDebugValue>
      </StyledDebugDetail>
    </>
  )
}

export const getConditionalContactReasonsEventConfig = (
  _data: ConditionalContactReasonsDebugEvent
): DebugEventConfig => {
  const title = 'Contact reasons condition'
  return {
    action: EventAction.ConditionalContactReasons,
    title,
    component: ConditionalContactReasons,
    icon: <SplitSvg />,
    collapsible: true,
  }
}
