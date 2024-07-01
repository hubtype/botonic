import { INPUT } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  HtIntentNode,
  HtKeywordNode,
  HtSmartIntentNode,
} from '../content-fields/hubtype-fields'
import { inputHasTextData } from '../utils'
import { getIntentNodeByInput } from './intent'
import { KeywordMatcher } from './keyword'
import { SmartIntentsApi, SmartIntentsInferenceConfig } from './smart-intent'

export async function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  smartIntentsConfig: SmartIntentsInferenceConfig
): Promise<HtSmartIntentNode | HtIntentNode | HtKeywordNode | undefined> {
  if (inputHasTextData(request.input)) {
    const keywordMatcher = new KeywordMatcher({
      cmsApi,
      locale,
      request,
    })
    const keywordNode = await keywordMatcher.getNodeByInput(request.input.data!)
    if (keywordNode) {
      return keywordNode
    }

    const smartIntentsApi = new SmartIntentsApi(
      cmsApi,
      request,
      smartIntentsConfig
    )
    const smartIntentNode = await smartIntentsApi.getNodeByInput()
    if (smartIntentNode) {
      return smartIntentNode
    }

    const intentNode = await getIntentNodeByInput(cmsApi, locale, request)
    if (intentNode) {
      return intentNode
    }
  }

  return undefined
}
