import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'

export interface ConditionalChannelDebugEvent {
  action: EventAction.ConditionalChannel
  channel: string
}
