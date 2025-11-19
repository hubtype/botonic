import { EventAction } from '@botonic/core'

import { SplitSvg } from '../icons/split'

export interface ConditionalQueueStatusDebugEvent {
  action: EventAction.ConditionalQueueStatus
  queue_id: string
  queue_name: string
  is_queue_open: boolean
  is_available_agent: boolean
}
