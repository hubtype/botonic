import {
  EventBotKeywordModel,
  EventName,
} from '@botonic/plugin-hubtype-analytics/lib/cjs/types'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { trackEvent } from './tracking'

export async function getNodeByKeyword(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  userInput: string
) {
  const keywordNode = cmsApi.getNodeByKeyword(userInput, locale)
  const eventBotKeywordModel: EventBotKeywordModel = {
    event_type: EventName.botKeywordsModel,
    event_data: {
      confidence_successful: true,
    },
  }
  if (keywordNode) {
    await trackEvent(request, eventBotKeywordModel)
    return keywordNode
  }
  return undefined
}
