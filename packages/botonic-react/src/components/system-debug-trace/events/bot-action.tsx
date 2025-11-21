import { EventAction } from '@botonic/core'
import React from 'react'

import { CodeSvg } from '../icons/code'
import { DebugEventConfig } from '../types'

export interface BotActionDebugEvent {
  action: EventAction.BotAction
  payload: string
}

export const getBotActionEventConfig = (
  data: BotActionDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Bot action triggered <span>- {data.payload}</span>
    </>
  )

  return {
    action: EventAction.BotAction,
    title,
    component: null,
    icon: <CodeSvg />,
    collapsible: false,
  }
}
