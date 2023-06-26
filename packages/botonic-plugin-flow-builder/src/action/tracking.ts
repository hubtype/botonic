import { HtEventProps } from '@botonic/plugin-hubtype-analytics/lib/cjs/types'
import { ActionRequest } from '@botonic/react'

import { getFlowBuilderPlugin } from '../helpers'

export async function trackEvent(request: ActionRequest, event: HtEventProps) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  if (flowBuilderPlugin.trackEvent) {
    await flowBuilderPlugin.trackEvent(request, event.event_type, event)
  }
  return
}
