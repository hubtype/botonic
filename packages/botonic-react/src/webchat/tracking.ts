import type {
  EventCustom,
  EventFeedback,
  EventFeedbackKnowledgebase,
} from '@botonic/core'
import { useContext } from 'react'
import { v7 as uuidv7 } from 'uuid'

import type { ActionRequest } from '../index-types'
import { WebchatContext } from './context'

export enum EventAction {
  FeedbackKnowledgebase = 'feedback_knowledgebase',
}
interface TrackKnowledgebaseFeedbackArgs {
  messageId: string
  isUseful: boolean
  botInteractionId?: string
  inferenceId?: string
}

enum FeedbackOption {
  ThumbsUp = 'thumbsUp',
  ThumbsDown = 'thumbsDown',
}

interface UseTracking {
  trackKnowledgebaseFeedback: ({
    messageId,
    isUseful,
    botInteractionId,
    inferenceId,
  }: TrackKnowledgebaseFeedbackArgs) => Promise<void>
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

  const trackKnowledgebaseFeedback = async ({
    messageId,
    isUseful,
    botInteractionId,
    inferenceId,
  }: TrackKnowledgebaseFeedbackArgs) => {
    if (!trackEvent) {
      return
    }
    const request = getRequest()

    // inferenceId and botInteractionId are strings, but in local development they are undefined
    const event: EventFeedbackKnowledgebase = {
      action: EventAction.FeedbackKnowledgebase,
      knowledgebaseInferenceId: inferenceId as string,
      feedbackBotInteractionId: botInteractionId as string,
      feedbackTargetId: messageId,
      feedbackGroupId: uuidv7(),
      possibleOptions: [FeedbackOption.ThumbsDown, FeedbackOption.ThumbsUp],
      possibleValues: [0, 1],
      option: isUseful ? FeedbackOption.ThumbsUp : FeedbackOption.ThumbsDown,
      value: isUseful ? 1 : 0,
    }
    const { action, ...eventArgs } = event

    await trackEvent(request, action, eventArgs)
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

  return { trackKnowledgebaseFeedback, trackCustomEvent, trackFeedbackEvent }
}
