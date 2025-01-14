import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtIntentNode } from '../content-fields/hubtype-fields'
import { EventAction, trackEvent } from '../tracking'

export async function getIntentNodeByInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtIntentNode | undefined> {
  const intentNode = cmsApi.getIntentNode(request.input, locale)

  if (request.input.confidence && request.input.intent && intentNode) {
    await trackIntentEvent(request, intentNode)

    if (isIntentValid(intentNode, request, cmsApi)) {
      return intentNode
    }
  }

  return undefined
}

async function trackIntentEvent(
  request: ActionRequest,
  intentNode: HtIntentNode
) {
  const eventArgs = {
    nluIntentLabel: request.input.intent,
    nluIntentConfidence: request.input.confidence,
    nluIntentThreshold: intentNode?.content.confidence,
    nluIntentMessageId: request.input.message_id,
    userInput: request.input.data,
    flowThreadId: request.session.flow_thread_id,
    flowId: intentNode.flow_id,
    flowNodeId: intentNode.id,
  }
  await trackEvent(request, EventAction.Intent, eventArgs)
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
