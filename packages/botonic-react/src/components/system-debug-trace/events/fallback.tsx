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

const getOrdinalSuffix = (num: number): string => {
  if (num === 1) return '1st'
  if (num === 2) return '2nd'
  return ''
}

export const getFallbackEventConfig = (
  data: FallbackDebugEvent
): DebugEventConfig => {
  const ordinal = getOrdinalSuffix(data.fallback_out)
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
