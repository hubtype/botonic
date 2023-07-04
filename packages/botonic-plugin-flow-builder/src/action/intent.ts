import {
  EventBotAiModel,
  EventName,
} from '@botonic/plugin-hubtype-analytics/lib/cjs/types'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  HtIntentNode,
  HtNodeWithContent,
} from '../content-fields/hubtype-fields'
import { trackEvent } from './tracking'

export async function getNodeByIntent(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
) {
  const intentNode = cmsApi.getIntentNode(request.input, locale)
  const eventBotAiModel: EventBotAiModel = {
    event_type: EventName.botAiModel,
    event_data: {
      intent: request.input.intent as string,
      confidence: request.input.confidence as number,
      confidence_successful: true,
    },
  }
  if (isIntentValid(intentNode, request, cmsApi) && intentNode?.target?.id) {
    await trackEvent(request, eventBotAiModel)
    return cmsApi.getNodeById<HtNodeWithContent>(intentNode.target.id)
  } else {
    eventBotAiModel.event_data.confidence_successful = false
    await trackEvent(request, eventBotAiModel)
    return undefined
  }
}

function isIntentValid(
  intentNode: HtIntentNode | undefined,
  request: ActionRequest,
  cmsApi: FlowBuilderApi
) {
  return (
    intentNode &&
    request.input.confidence &&
    cmsApi.hasMetConfidenceThreshold(intentNode, request.input.confidence)
  )
}
