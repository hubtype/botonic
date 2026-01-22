import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  inputHasTextData,
  isKeywordsAllowed,
  isSmartIntentsAllowed,
} from '../utils'
import { CaptureUserInputApi } from './capture-user-input-api'
import { KeywordMatcher } from './keyword'
import { SmartIntentsApi, SmartIntentsInferenceConfig } from './smart-intent'

export async function getNextPayloadByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  smartIntentsConfig: SmartIntentsInferenceConfig
): Promise<string | undefined> {
  if (inputHasTextData(request.input)) {
    if (cmsApi.shouldCaptureUserInput()) {
      const captureUserInputApi = new CaptureUserInputApi(
        cmsApi,
        request as unknown as ActionRequest
      )
      const nextNodeId = await captureUserInputApi.getNextNodeId()
      return nextNodeId
    }

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
        return cmsApi.getPayload(keywordNode.target)
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
        return cmsApi.getPayload(smartIntentNode.target)
      }
    }
  }

  return undefined
}
