import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  HtIntentNode,
  HtKeywordNode,
  HtSmartIntentNode,
} from '../content-fields/hubtype-fields'
import { getIntentNodeByInput } from './intent'
import { getKeywordNodeByInput } from './keyword'
import { SmartIntentsApi } from './smart-intent'

export async function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtSmartIntentNode | HtIntentNode | HtKeywordNode | undefined> {
  if (request.input.data) {
    const keywordNode = await getKeywordNodeByInput(
      cmsApi,
      locale,
      request,
      request.input.data
    )
    if (keywordNode) return keywordNode

    const smartIntentsApi = new SmartIntentsApi(cmsApi, request)
    const smartIntentNode = smartIntentsApi.getNodeByInput()
    if (smartIntentNode) return smartIntentNode

    const intentNode = await getIntentNodeByInput(cmsApi, locale, request)
    if (intentNode) return intentNode
  }
  return undefined
}
