import { EventAction } from '@botonic/core'
import React from 'react'

import { SplitSvg } from '../icons/split'
import { DebugEventConfig } from '../types'

export interface ConditionalChannelDebugEvent {
  action: EventAction.ConditionalChannel
  channel: string
}

export const getConditionalChannelEventConfig = (
  data: ConditionalChannelDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Channel checked <span>- {data.channel}</span>
    </>
  )

  return {
    action: EventAction.ConditionalChannel,
    title,
    component: null,
    icon: <SplitSvg />,
    collapsible: false,
  }
}
