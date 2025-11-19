import { EventAction } from '@botonic/core'

import { ArrowProgressSvg } from '../icons/arrow-progress'

export interface RedirectFlowDebugEvent {
  action: EventAction.RedirectFlow
  flow_id: string
  flow_name: string
  flow_target_id: string
  flow_target_name: string
}
