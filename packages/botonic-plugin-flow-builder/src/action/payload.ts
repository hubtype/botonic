import { EventAction, EventFeedback, storeCaseRating } from '@botonic/core'
import { v7 as uuid } from 'uuid'

import {
  AGENT_RATING_PAYLOAD,
  PUSH_FLOW_PAYLOAD,
  SEPARATOR,
} from '../constants'
import { FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { trackEvent } from '../tracking'
import { FlowBuilderContext } from './index'

export async function getContentsByPayload(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { cmsApi, flowBuilderPlugin, request, contentID } = context
  if (request.input.payload?.startsWith(AGENT_RATING_PAYLOAD)) {
    return await resolveRatingPayload(context)
  }
  if (request.input.payload?.startsWith(PUSH_FLOW_PAYLOAD)) {
    return await resolvePushFlowPayload(context)
  }

  const id = contentID
    ? cmsApi.getNodeByContentID(contentID)?.id
    : request.input.payload
  const targetNode = id ? cmsApi.getNodeById<HtNodeWithContent>(id) : undefined

  if (targetNode) {
    return await flowBuilderPlugin.getContentsByNode(targetNode)
  }

  return []
}

async function resolveRatingPayload(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { cmsApi, flowBuilderPlugin, request } = context

  if (!request.input.payload) {
    return []
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
    return await flowBuilderPlugin.getContentsByNode(targetNode)
  }

  return []
}

async function resolvePushFlowPayload(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { cmsApi, flowBuilderPlugin, request } = context

  if (!request.input.payload) {
    return []
  }

  const pushFlowId = request.input.payload.split(SEPARATOR)[1] || ''

  if (!pushFlowId) {
    return []
  }

  const pushFlowNode = cmsApi.getNodeByCampaignId<HtNodeWithContent>(pushFlowId)

  if (!pushFlowNode) {
    return []
  }

  return await flowBuilderPlugin.getContentsByNode(pushFlowNode)
}
