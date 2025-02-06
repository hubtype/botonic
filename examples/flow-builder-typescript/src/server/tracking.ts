import { EventAction, HtEventProps } from '@botonic/plugin-hubtype-analytics'

import { BotRequest } from './types'
import { isLocal } from './utils/env-utils'

type EventArgs = { [key: string]: any }

export async function trackEvent(
  request: BotRequest,
  eventName: string,
  args?: EventArgs
): Promise<void> {
  if (Object.values(EventAction).includes(eventName as EventAction)) {
    const htEventProps = {
      action: eventName as EventAction,
      ...args,
    }
    await trackHtEvent(request, htEventProps as HtEventProps)
  }
  return
}

export async function trackHtEvent(
  request: BotRequest,
  htEventProps: HtEventProps
) {
  if (isLocal()) {
    console.log('TrackHtEvent', { htEventProps })
    return
  }
  const hubtypeAnalytics = request.plugins.hubtypeAnalytics
  try {
    await hubtypeAnalytics.trackEvent(request, htEventProps)
    console.log('TrackHtEvent Success', {
      action: htEventProps.action,
    })
  } catch (error: unknown) {
    console.error('TrackHtEvent Error', {
      action: htEventProps.action,
    })
  }

  return
}
