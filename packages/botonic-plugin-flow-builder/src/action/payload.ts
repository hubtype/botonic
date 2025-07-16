import { storeCaseRating } from '@botonic/core'
import { v7 as uuid } from 'uuid'

import { AGENT_RATING_PAYLOAD, SEPARATOR } from '../constants'
import { FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { EventAction, trackEvent } from '../tracking'
import { FlowBuilderContext } from './index'

export async function getContentsByPayload(
  context: FlowBuilderContext
): Promise<FlowContent[]> {
  const { cmsApi, flowBuilderPlugin, request, contentID } = context
  if (request.input.payload?.startsWith(AGENT_RATING_PAYLOAD)) {
    return await resolveRatingPayload(context)
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

  const id = request.input.payload
  const buttonId = id?.split(SEPARATOR)[1]
  const ratingNode = cmsApi.getRatingNodeByButtonId(buttonId)
  const ratingButton = cmsApi.getRatingButtonById(ratingNode, buttonId)
  const { target, text, value } = ratingButton
  const possibleOptions = ratingNode.content.buttons.map(button => button.text)
  const possibleValues = ratingNode.content.buttons.map(button => button.value)

  if (request.session._hubtype_case_id) {
    const event = {
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
