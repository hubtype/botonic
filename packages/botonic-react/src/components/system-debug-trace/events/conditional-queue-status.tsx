import { EventAction } from '@botonic/core'
import React from 'react'

import { SplitSvg } from '../icons/split'
import { DebugEventConfig } from '../types'

export interface ConditionalQueueStatusDebugEvent {
  action: EventAction.ConditionalQueueStatus
  queue_id: string
  queue_name: string
  is_queue_open: boolean
  is_available_agent: boolean
}

export const getConditionalQueueStatusEventConfig = (
  data: ConditionalQueueStatusDebugEvent
): DebugEventConfig => {
  const queueStatus = data.is_queue_open ? 'Open' : 'Closed'
  const agentStatus = data.is_available_agent ? 'Available' : 'Unavailable'
  const statusText = `${queueStatus}${queueStatus === 'Open' ? ` (Agent ${agentStatus})` : ''}`

  const title = (
    <>
      Queue status checked{' '}
      <span>
        - {statusText} ( Queue: {data.queue_name})
      </span>
    </>
  )

  return {
    action: EventAction.ConditionalQueueStatus,
    title,
    component: null,
    icon: <SplitSvg />,
    collapsible: false,
  }
}
