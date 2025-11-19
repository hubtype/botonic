import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'

export interface ConditionalCustomDebugEvent {
  action: EventAction.ConditionalCustom
  conditional_variable: string
  variable_format: string
}
