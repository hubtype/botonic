import type { ActionRequest } from '@botonic/react'

import type { FlowBuilderApi } from '../api'
import {
  getTextOrTranscript,
  isKeywordsAllowed,
  isSmartIntentsAllowed,
} from '../utils/input'
import { CaptureUserInputApi } from './capture-user-input-api'
import { KeywordMatcher } from './keyword'
import {
  SmartIntentsApi,
  type SmartIntentsInferenceConfig,
} from './smart-intent'

export async function getNextPayloadByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest,
  smartIntentsConfig: SmartIntentsInferenceConfig
): Promise<string | undefined> {
  const userTextOrTranscript = getTextOrTranscript(request.input)
  if (userTextOrTranscript) {
    if (cmsApi.shouldCaptureUserInput()) {
      const captureUserInputApi = new CaptureUserInputApi(
        cmsApi,
        request,
        userTextOrTranscript
      )
      return await captureUserInputApi.getNextNodeId()
    }

    if (isKeywordsAllowed(request)) {
      const keywordMatcher = new KeywordMatcher({
        cmsApi,
        locale,
        request,
        userTextOrTranscript,
      })
      const keywordNode = await keywordMatcher.getNodeByInput()
      if (keywordNode) {
        return cmsApi.getPayload(keywordNode.target)
      }
    }

    if (isSmartIntentsAllowed(request)) {
      const smartIntentsApi = new SmartIntentsApi(
        cmsApi,
        request,
        smartIntentsConfig,
        userTextOrTranscript
      )
      const smartIntentNode = await smartIntentsApi.getNodeByInput()
      if (smartIntentNode) {
        return cmsApi.getPayload(smartIntentNode.target)
      }
    }
  }

  return undefined
}
