import { EventAction } from '@botonic/core'

import { CodeSvg } from '../icons/code'

export interface BotActionDebugEvent {
  action: EventAction.BotAction
  payload: string
}
