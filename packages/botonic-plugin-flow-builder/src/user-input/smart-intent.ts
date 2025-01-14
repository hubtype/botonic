import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'
import { getFlowBuilderPlugin } from '../helpers'
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
    public smartIntentsConfig: SmartIntentsInferenceConfig,
    public flowId?: string
  ) {}

  async getNodeByInput(): Promise<HtSmartIntentNode | undefined> {
    if (!this.currentRequest.input.data) return undefined
    const smartIntentNodes = this.cmsApi.getSmartIntentNodes()
    if (!smartIntentNodes.length) return undefined

    const params = {
      bot_id: this.currentRequest.session.bot.id,
      text: this.currentRequest.input.data,
      num_smart_intents_to_use: this.smartIntentsConfig.numSmartIntentsToUse,
      use_latest: this.resolveUseLatest(),
    }

    try {
      const response = await this.getInference(params)
      const smartIntentNode = smartIntentNodes.find(
        smartIntentNode =>
          smartIntentNode.content.title === response.data.smart_intent_title
      )
      if (smartIntentNode) {
        await trackEvent(this.currentRequest, EventAction.IntentSmart, {
          nluIntentSmartTitle: response.data.smart_intent_title,
          nluIntentSmartNumUsed: response.data.smart_intents_used.length,
          nluIntentSmartMessageId: this.currentRequest.input.message_id,
          userInput: this.currentRequest.input.data,
          flowThreadId: this.currentRequest.session.flow_thread_id,
          flowId: smartIntentNode.flow_id,
          flowNodeId: smartIntentNode.id,
        })
        return smartIntentNode
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }

  private resolveUseLatest(): boolean {
    if (this.currentRequest.session.is_test_integration) return false
    return this.smartIntentsConfig.useLatest
  }

  private async getInference(
    inferenceParams: SmartIntentsInferenceParams
  ): Promise<SmartIntentResponse> {
    const pluginFlowBuilder = getFlowBuilderPlugin(this.currentRequest.plugins)
    const token = pluginFlowBuilder.getAccessToken(this.currentRequest.session)

    return await axios({
      method: 'POST',
      url: `${process.env.HUBTYPE_API_URL}/external/v2/ai/smart_intents/inference/`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: inferenceParams,
      timeout: 10000,
    })
  }
}
