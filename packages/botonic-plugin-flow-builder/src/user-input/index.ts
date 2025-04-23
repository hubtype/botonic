import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  HtKeywordNode,
  HtSmartIntentNode,
} from '../content-fields/hubtype-fields'
import {
  inputHasTextData,
  isKeywordsAllowed,
  isSmartIntentsAllowed,
} from '../utils'
import { KeywordMatcher } from './keyword'
import { SmartIntentsApi, SmartIntentsInferenceConfig } from './smart-intent'

export async function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  smartIntentsConfig: SmartIntentsInferenceConfig
): Promise<HtSmartIntentNode | HtKeywordNode | undefined> {
  if (inputHasTextData(request.input)) {
    if (isKeywordsAllowed(request)) {
      const keywordMatcher = new KeywordMatcher({
        cmsApi,
        locale,
        request,
      })
      const keywordNode = await keywordMatcher.getNodeByInput(
        request.input.data!
      )
      if (keywordNode) {
        return keywordNode
      }
    }

    if (isSmartIntentsAllowed(request)) {
      const smartIntentsApi = new SmartIntentsApi(
        cmsApi,
        request,
        smartIntentsConfig
      )
      const smartIntentNode = await smartIntentsApi.getNodeByInput()
      if (smartIntentNode) {
        return smartIntentNode
      }
    }
  }

  return undefined
}
