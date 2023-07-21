import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  HtIntentNode,
  HtNodeWithContent,
} from '../content-fields/hubtype-fields'
import { EventName, trackEvent } from './tracking'

export async function getNodeByIntent(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtNodeWithContent | undefined> {
  const intentNode = cmsApi.getIntentNode(request.input, locale)
  const event = {
    intent: request.input.intent as string,
    confidence: request.input.confidence as number,
    confidence_successful: true,
  }
  if (isIntentValid(intentNode, request, cmsApi) && intentNode?.target?.id) {
    await trackEvent(request, EventName.botAiModel, event)
    return cmsApi.getNodeById<HtNodeWithContent>(intentNode.target.id)
  } else {
    event.confidence_successful = false
    await trackEvent(request, EventName.botAiModel, event)
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
