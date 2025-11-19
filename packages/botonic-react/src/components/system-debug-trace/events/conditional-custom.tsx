import { EventAction } from '@botonic/core'
import React from 'react'

import { SplitSvg } from '../icons/split'
import { DebugEventConfig } from '../types'

export interface ConditionalCustomDebugEvent {
  action: EventAction.ConditionalCustom
  conditional_variable: string
  variable_format: string
}

export const getConditionalCustomEventConfig = (
  data: ConditionalCustomDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Custom condition checked <span>- {data.conditional_variable}</span>
    </>
  )

  return {
    action: EventAction.ConditionalCustom,
    title,
    component: null,
    icon: <SplitSvg />,
    collapsible: false,
  }
}
