import { EventAction } from '@botonic/core'
import React from 'react'

import { ArrowProgressSvg } from '../icons/arrow-progress'
import { DebugEventConfig } from '../types'

export interface RedirectFlowDebugEvent {
  action: EventAction.RedirectFlow
  flow_id: string
  flow_name: string
  flow_target_id: string
  flow_target_name: string
}

export const getRedirectFlowEventConfig = (
  data: RedirectFlowDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Redirected to flow{' '}
      <span>
        - From &quot;{data.flow_name}&quot; to &quot;{data.flow_target_name}
        &quot;
      </span>
    </>
  )

  return {
    action: EventAction.RedirectFlow,
    title,
    component: null,
    icon: <ArrowProgressSvg />,
    collapsible: false,
  }
}
