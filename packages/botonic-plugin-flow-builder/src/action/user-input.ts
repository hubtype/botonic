import {
  EventBotStart,
  EventName,
} from '@botonic/plugin-hubtype-analytics/lib/cjs/types'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getNodeByIntent } from './intent'
import { getNodeByKeyword } from './keyword'
import { trackEvent } from './tracking'

export async function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtNodeWithContent | undefined> {
  if (request.session.is_first_interaction) {
    const startNode = cmsApi.getStartNode()
    const event: EventBotStart = {
      event_type: EventName.botStart,
    }
    await trackEvent(request, event)
    return startNode
  }

  if (request.input.data) {
    const nodeByIntent = await getNodeByIntent(cmsApi, locale, request)
    if (nodeByIntent) return nodeByIntent

    const keywordNode = await getNodeByKeyword(
      cmsApi,
      locale,
      request,
      request.input.data
    )
    if (keywordNode) return keywordNode
  }
  return undefined
}
