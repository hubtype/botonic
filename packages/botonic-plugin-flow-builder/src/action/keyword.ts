import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { EventName, trackEvent } from './tracking'

export async function getNodeByKeyword(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  userInput: string
): Promise<HtNodeWithContent | undefined> {
  const keywordNode = cmsApi.getNodeByKeyword(userInput, locale)
  if (!keywordNode) {
    return undefined
  }
  const event = {
    event_type: EventName.botKeywordsModel,
    event_data: {
      confidence_successful: true,
    },
  }
  await trackEvent(request, EventName.botKeywordsModel, event)
  return keywordNode
}
