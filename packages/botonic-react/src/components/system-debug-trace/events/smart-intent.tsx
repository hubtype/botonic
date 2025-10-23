import { EventAction } from '@botonic/core'
import React from 'react'

import { BrainSvg } from '../icons'
import { DebugEventConfig } from '../types'

export interface SmartIntentDebugEvent {
  action: EventAction.IntentSmart
  nlu_intent_smart_title: string
}

export const getSmartIntentEventConfig = (
  data: SmartIntentDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Intent triggered <span>- {data.nlu_intent_smart_title}</span>
    </>
  )
  return {
    action: EventAction.IntentSmart,
    title,
    component: null,
    icon: <BrainSvg />,
  }
}
