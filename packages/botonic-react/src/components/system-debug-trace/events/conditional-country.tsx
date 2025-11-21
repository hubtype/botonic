import { EventAction } from '@botonic/core'
import React from 'react'

import { SplitSvg } from '../icons/split'
import { DebugEventConfig } from '../types'

export interface ConditionalCountryDebugEvent {
  action: EventAction.ConditionalCountry
  country: string
}

export const getConditionalCountryEventConfig = (
  data: ConditionalCountryDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Country checked <span>- {data.country}</span>
    </>
  )

  return {
    action: EventAction.ConditionalCountry,
    title,
    component: null,
    icon: <SplitSvg />,
    collapsible: false,
  }
}
