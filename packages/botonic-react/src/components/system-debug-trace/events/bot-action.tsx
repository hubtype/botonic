import { EventAction } from '@botonic/core'

import { CodeSvg } from '../icons/code'
import type { DebugEventConfig } from '../types'

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
