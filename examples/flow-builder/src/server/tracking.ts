import BotonicPluginHubtypeAnalytics, {
  EventAction,
  EventCustom,
  EventFeedback,
  EventHandoff,
  EventHandoffOption,
  EventWebviewEnd,
  EventWebviewStep,
  HtEventProps,
} from '@botonic/plugin-hubtype-analytics'
import { ActionRequest } from '@botonic/react'

import { BotRequest } from './types'
import { isBrowser, isLocal } from './utils/env-utils'

export type EventPropsMap = {
  [EventAction.FeedbackCase]: Omit<EventFeedback, 'action'>
  [EventAction.FeedbackConversation]: Omit<EventFeedback, 'action'>
  [EventAction.FeedbackWebview]: Omit<EventFeedback, 'action'>
  [EventAction.HandoffOption]: Omit<EventHandoffOption, 'action'>
  [EventAction.HandoffFail]: Omit<EventHandoff, 'action'>
  [EventAction.WebviewStep]: Omit<EventWebviewStep, 'action'>
  [EventAction.WebviewEnd]: Omit<EventWebviewEnd, 'action'>
  [EventAction.Custom]: Omit<EventCustom, 'action'>
}

export async function trackEvent<T extends keyof EventPropsMap>(
  request: BotRequest,
  eventName: T,
  eventProps?: EventPropsMap[T]
): Promise<void> {
  if (isLocal()) {
    console.log('Tracking event...', eventName, eventProps)
    return
  }

  const htEventProps = eventProps
    ? {
        action: eventName as EventAction,
        ...eventProps,
      }
    : { action: eventName as EventAction }

  await trackHtEvent(request, htEventProps as HtEventProps)
}

export async function trackHtEvent(
  request: ActionRequest,
  htEventProps: HtEventProps
) {
  const printLogs = !isBrowser()
  const hubtypeAnalyticsPlugin = isBrowser()
    ? new BotonicPluginHubtypeAnalytics()
    : (request.plugins.hubtypeAnalytics as BotonicPluginHubtypeAnalytics)
  try {
    const response = await hubtypeAnalyticsPlugin.trackEvent(
      request,
      htEventProps
    )
    printLogs && console.log('TrackHtEvent Success', { data: response.data })
  } catch (error: any) {
    printLogs &&
      console.log(
        'TrackHtEvent Error',
        { error },
        JSON.stringify(error.response?.data),
        {
          errorData: error.response?.data,
        }
      )
  }
  return
}
