import type { BotContext } from '@botonic/core'

import type { FlowBuilderApi } from '../api'
import {
  getTextOrTranscript,
  isKeywordsAllowed,
  isSmartIntentsAllowed,
} from '../utils/input'
import { CaptureUserInputResolver } from './capture-user-input-resolver'
import { KeywordMatcher } from './keyword'
import {
  type SmartIntentsInferenceConfig,
  SmartIntentsResolver,
} from './smart-intent-resolver'

export async function getNextPayloadByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  botContext: BotContext,
  smartIntentsConfig: SmartIntentsInferenceConfig
): Promise<string | undefined> {
  const userTextOrTranscript = getTextOrTranscript(botContext.input)
  if (userTextOrTranscript) {
    if (cmsApi.shouldCaptureUserInput()) {
      const captureUserInputApi = new CaptureUserInputResolver(
        cmsApi,
        botContext,
        userTextOrTranscript
      )
      return await captureUserInputApi.getNextNodeId()
    }

    if (isKeywordsAllowed(botContext)) {
      const keywordMatcher = new KeywordMatcher({
        cmsApi,
        locale,
        request: botContext,
        userTextOrTranscript,
      })
      const keywordNode = await keywordMatcher.getNodeByInput()
      if (keywordNode) {
        return cmsApi.getPayload(keywordNode.target)
      }
    }

    if (isSmartIntentsAllowed(botContext)) {
      const smartIntentsResolver = new SmartIntentsResolver(
        cmsApi,
        botContext,
        smartIntentsConfig,
        userTextOrTranscript
      )
      const smartIntentNode = await smartIntentsResolver.getNodeByInput()
      if (smartIntentNode) {
        return cmsApi.getPayload(smartIntentNode.target)
      }
    }
  }

  return undefined
}
