import { EventAction } from '@botonic/core'
import React from 'react'

import { LifeRingSvg } from '../icons/life-ring'
import { DebugEventConfig } from '../types'

export interface FallbackDebugEvent {
  action: EventAction.Fallback
  user_input: string
  fallback_out: number
  fallback_message_id: string
}

export const getFallbackEventConfig = (
  data: FallbackDebugEvent
): DebugEventConfig => {
  const ordinal = data.fallback_out === 1 ? '1st' : '2nd'
  const title = (
    <>
      Fallback message triggered <span>- {ordinal} message</span>
    </>
  )

  return {
    action: EventAction.Fallback,
    title,
    component: null,
    icon: <LifeRingSvg />,
    collapsible: false,
  }
}
