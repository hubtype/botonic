import { EventAction, type EventFeedback, storeCaseRating } from '@botonic/core'
import { v7 as uuid } from 'uuid'
import { AGENT_RATING_PAYLOAD, PUSH_FLOW_PAYLOAD } from '../constants'
import type { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { trackEvent } from '../tracking'
import type { FlowBuilderContentsResult } from './contents-result'
import type { FlowBuilderContext } from './context'
import { PushFlowResolver } from './push-flow-resolver'

export async function getContentsByPayload(
  context: FlowBuilderContext
): Promise<FlowBuilderContentsResult> {
  const { cmsApi, flowBuilderPlugin, request, contentID } = context
  if (request.input.payload?.startsWith(AGENT_RATING_PAYLOAD)) {
    return await resolveRatingPayload(context)
  }
  if (request.input.payload?.startsWith(PUSH_FLOW_PAYLOAD)) {
    const pushFlow = new PushFlowResolver(context)
    return await pushFlow.getContents()
  }

  const id = contentID
    ? cmsApi.getNodeByContentID(contentID)?.id
    : request.input.payload
  const targetNode = id ? cmsApi.getNodeById<HtNodeWithContent>(id) : undefined

  if (targetNode) {
    return {
      contents: await flowBuilderPlugin.getContentsByNode(targetNode),
    }
  }

  return { contents: [] }
}

async function resolveRatingPayload(
  context: FlowBuilderContext
): Promise<FlowBuilderContentsResult> {
  const { cmsApi, flowBuilderPlugin, request } = context

  if (!request.input.payload) {
    return { contents: [] }
  }

  const { target, text, value, possibleOptions, possibleValues } =
    flowBuilderPlugin.getRatingSubmittedInfo(request.input.payload)

  if (request.session._hubtype_case_id) {
    const event: EventFeedback = {
      action: EventAction.FeedbackCase,
      feedbackTargetId: request.session._hubtype_case_id,
      feedbackGroupId: uuid().toString(),
      possibleOptions,
      possibleValues,
      option: text,
      value,
    }

    await storeCaseRating(request.session, value)
    await trackEvent(request, EventAction.FeedbackCase, event)
  }

  const targetNode = target
    ? cmsApi.getNodeById<HtNodeWithContent>(target.id)
    : undefined

  if (targetNode) {
    return {
      contents: await flowBuilderPlugin.getContentsByNode(targetNode),
    }
  }

  return { contents: [] }
}
