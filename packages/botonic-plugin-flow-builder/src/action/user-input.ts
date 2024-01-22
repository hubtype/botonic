import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { HtIntentNode, HtKeywordNode } from '../content-fields/hubtype-fields'
import { getIntentNodeByInput } from './intent'
import { getKeywordNodeByInput } from './keyword'

export async function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): Promise<HtIntentNode | HtKeywordNode | undefined> {
  if (request.input.data) {
    const intentNode = await getIntentNodeByInput(cmsApi, locale, request)
    if (intentNode) return intentNode

    const keywordNode = await getKeywordNodeByInput(
      cmsApi,
      locale,
      request,
      request.input.data
    )
    if (keywordNode) return keywordNode
  }
  return undefined
}
