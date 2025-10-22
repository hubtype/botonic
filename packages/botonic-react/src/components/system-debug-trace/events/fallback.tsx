import { EventAction } from '@botonic/core'
import React from 'react'

import { LifeRingSvg } from '../icons/life-ring'

export interface FallbackDebugEvent {
  action: EventAction.Fallback
  user_input: string
  fallback_out: number
  fallback_message_id: string
}

export const Fallback = (_props: FallbackDebugEvent) => {
  return null
}

const getOrdinalSuffix = (num: number): string => {
  if (num === 1) return '1st'
  if (num === 2) return '2nd'
  if (num === 3) return '3rd'
  return `${num}th`
}

export const getFallbackEventConfig = (fallbackOut: number) => {
  const ordinal = getOrdinalSuffix(fallbackOut)
  return {
    action: EventAction.Fallback,
    title: (
      <>
        Fallback message triggered <span>- {ordinal} message</span>
      </>
    ),
    component: Fallback,
    icon: <LifeRingSvg color={'#666A7A'} />,
    collapsible: false,
  }
}

export const fallbackEventConfig = {
  action: EventAction.Fallback,
  title: 'Fallback message triggered',
  component: Fallback,
  icon: <LifeRingSvg color={'#666A7A'} />,
  collapsible: false,
}
