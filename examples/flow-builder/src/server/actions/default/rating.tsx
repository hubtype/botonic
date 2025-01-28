import { storeCaseRating } from '@botonic/core'
import {
  FlowBuilderActionProps,
  type PayloadParamsBase,
} from '@botonic/plugin-flow-builder'
import { EventAction } from '@botonic/plugin-hubtype-analytics'
import { RequestContext } from '@botonic/react'
import { v7 } from 'uuid'

import { trackEvent } from '../../tracking'
import { BotRequest } from '../../types'
import { getRequestData } from '../../utils/actions'
import { ExtendedFlowBuilderAction } from './extended-flow-builder'

interface PayloadParams extends PayloadParamsBase {
  value?: number | string
}

//Action used to store and track the rating selected by the user
export class RatingAction extends ExtendedFlowBuilderAction {
  static contextType = RequestContext
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    const { payload, cmsPlugin, session } = getRequestData(request)

    if (payload) {
      const { value, followUpContentID } =
        cmsPlugin.getPayloadParams<PayloadParams>(payload)

      if (value) {
        const sanitizedValue = Number(value)

        await storeRatingToBackend(request, sanitizedValue)

        const possibleValues = [5, 4, 3, 2, 1]

        await trackEvent(request, EventAction.FeedbackCase, {
          feedbackTargetId: session._hubtype_case_id as string,
          feedbackGroupId: v7(),
          value: sanitizedValue,
          possibleValues,
          possibleOptions: possibleValues.map(getStars),
          option: getStars(sanitizedValue),
        })
      }

      return super.botonicInit(request, { contentId: followUpContentID })
    }

    return super.botonicInit(request)
  }
}

async function storeRatingToBackend(
  request: BotRequest,
  value: number
): Promise<void> {
  try {
    await storeCaseRating(request.session, value)
  } catch (e: any) {
    const chatId = request.session.user.id
    console.error(
      `Error while storing case rating: ${value} (${chatId}):`,
      e.message
    )
  }
}

function getStars(value: number): string {
  return '⭐'.repeat(value)
}
