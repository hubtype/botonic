import type { EventCustom, EventFeedback } from '@botonic/core'
import { useContext } from 'react'

import type { ActionRequest } from '../index-types'
import { WebchatContext } from './context'

interface UseTracking {
  trackCustomEvent: (event: EventCustom) => Promise<void>
  trackFeedbackEvent: (event: EventFeedback) => Promise<void>
}

export function useTracking(): UseTracking {
  const { webchatState, trackEvent } = useContext(WebchatContext)

  const getRequest = () => {
    const request = {
      session: {
        ...webchatState.session,
      },
      getUserCountry: () => webchatState.session.user?.country || '',
      getUserLocale: () => webchatState.session.user?.locale || '',
      getSystemLocale: () => {
        return webchatState.session.user?.system_locale || ''
      },
    } as unknown as ActionRequest

    return request
  }

  const trackCustomEvent = async (event: EventCustom) => {
    if (!trackEvent) {
      return
    }

    const request = getRequest()
    const { action, ...eventArgs } = event
    await trackEvent(request, action, eventArgs)
  }

  const trackFeedbackEvent = async (event: EventFeedback) => {
    if (!trackEvent) {
      return
    }

    const request = getRequest()
    const { action, ...eventArgs } = event
    await trackEvent(request, action, eventArgs)
  }

  return { trackCustomEvent, trackFeedbackEvent }
}
