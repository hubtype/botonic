import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'

export interface SmartIntentsInferenceParams
  extends SmartIntentsInferenceConfig {
  bot_id: string
  text: string
}

export interface SmartIntentsInferenceConfig {
  use_latest: boolean
  num_smart_intents_to_use?: number
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
      ...this.smartIntentsConfig,
    }

    try {
      const response = await this.getInference(params)
      return smartIntentNodes.find(
        smartIntentNode =>
          smartIntentNode.content.title === response.data.smart_intent_title
      )
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  private async getInference(
    inferenceParams: SmartIntentsInferenceParams
  ): Promise<{ data: { smart_intent_title: string } }> {
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
