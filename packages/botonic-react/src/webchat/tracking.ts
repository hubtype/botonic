import { EventFeedbackKnowledgebase } from '@botonic/core'
import { useContext } from 'react'
import { v7 as uuidv7 } from 'uuid'

import { ActionRequest } from '../index-types'
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

export function useTracking() {
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

    const request = getRequest()

    await trackEvent(request, EventAction.FeedbackKnowledgebase, args)
  }

  return { trackKnowledgebaseFeedback }
}
