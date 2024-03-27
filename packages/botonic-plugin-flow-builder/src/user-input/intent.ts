import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtIntentNode } from '../content-fields/hubtype-fields'
import { EventName, trackEvent } from '../tracking'

export async function getIntentNodeByInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtIntentNode | undefined> {
  const intentNode = cmsApi.getIntentNode(request.input, locale)
  const eventArgs = {
    intent: request.input.intent as string,
    confidence: request.input.confidence as number,
    confidence_successful: true,
  }
  if (request.input.confidence && request.input.intent && intentNode) {
    if (isIntentValid(intentNode, request, cmsApi)) {
      await trackEvent(request, EventName.botAiModel, eventArgs)
      return intentNode
    }

    eventArgs.confidence_successful = false
    await trackEvent(request, EventName.botAiModel, eventArgs)
  }

  return undefined
}

function isIntentValid(
  intentNode: HtIntentNode,
  request: ActionRequest,
  cmsApi: FlowBuilderApi
) {
  return (
    request.input.confidence &&
    cmsApi.hasMetConfidenceThreshold(intentNode, request.input.confidence)
  )
}
