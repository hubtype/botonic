import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtKeywordNode } from '../content-fields/hubtype-fields'
import { EventName, trackEvent } from '../tracking'

export async function getKeywordNodeByInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  userInput: string
): Promise<HtKeywordNode | undefined> {
  const keywordNode = cmsApi.getNodeByKeyword(userInput, locale)
  if (!keywordNode) {
    return undefined
  }
  const eventArgs = {
    confidence_successful: true,
  }
  await trackEvent(request, EventName.botKeywordsModel, eventArgs)
  return keywordNode
}
