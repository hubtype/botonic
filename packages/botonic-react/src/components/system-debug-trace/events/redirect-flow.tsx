import { EventAction } from '@botonic/core'

import { ArrowProgressSvg } from '../icons/arrow-progress'
import type { DebugEventConfig } from '../types'

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
      Redirected to flow <span>- {data.flow_target_name}</span>
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
