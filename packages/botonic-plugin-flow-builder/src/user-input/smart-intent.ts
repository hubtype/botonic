import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'
import { EventAction, trackEvent } from '../tracking'
import { SmartIntentResponse } from '../types'

export interface SmartIntentsInferenceParams {
  bot_id: string
  text: string
  num_smart_intents_to_use?: number
  use_latest: boolean
}

export interface SmartIntentsInferenceConfig {
  useLatest: boolean
  numSmartIntentsToUse?: number
}

export class SmartIntentsApi {
  constructor(
    public cmsApi: FlowBuilderApi,
    public currentRequest: ActionRequest,
    public smartIntentsConfig: SmartIntentsInferenceConfig
  ) {}

  async getNodeByInput(): Promise<HtSmartIntentNode | undefined> {
    if (!this.currentRequest.input.data) return undefined
    const smartIntentNodes = this.cmsApi.getSmartIntentNodes()
    if (!smartIntentNodes.length) return undefined

    const params = {
      bot_id: this.currentRequest.session.bot.id,
      text: this.currentRequest.input.data,
      num_smart_intents_to_use: this.smartIntentsConfig.numSmartIntentsToUse,
      use_latest: this.smartIntentsConfig.useLatest,
    }

    try {
      const response = await this.getInference(params)
      const smartIntentNode = smartIntentNodes.find(
        smartIntentNode =>
          smartIntentNode.content.title === response.data.smart_intent_title
      )
      if (smartIntentNode) {
        trackEvent(this.currentRequest, EventAction.intentSmart, {
          nluIntentSmartTitle: response.data.smart_intent_title,
          nluIntentSmartNumUsed: response.data.smart_intents_used.length,
          nluIntentSmartMessageId: this.currentRequest.input.message_id,
        })
        return smartIntentNode
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }

  private async getInference(
    inferenceParams: SmartIntentsInferenceParams
  ): Promise<SmartIntentResponse> {
    return await axios({
      method: 'POST',
      url: `${process.env.HUBTYPE_API_URL}/external/v2/ai/smart_intents/inference/`,
      headers: {
        Authorization: `Bearer ${this.currentRequest.session._access_token}`,
        'Content-Type': 'application/json',
      },
      data: inferenceParams,
      timeout: 10000,
    })
  }
}
