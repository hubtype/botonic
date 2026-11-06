import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from '../constants'
import type { SmartIntentResponse } from '../types'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

export interface SmartIntentsInferenceParams {
  bot_id: string
  text: string
  num_smart_intents_to_use?: number
  use_latest: boolean
  disabled_smart_intent_titles: string[]
}

export class SmartIntentsApi {
  private hubtypeApiUrl: string
  private accessToken: string

  constructor(botContext: BotContext) {
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
  }

  async getInference(
    inferenceParams: SmartIntentsInferenceParams
  ): Promise<SmartIntentResponse> {
    return await axios({
      method: 'POST',
      url: `${this.hubtypeApiUrl}/external/v2/ai/smart_intents/inference/`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: inferenceParams,
      timeout: 10000,
    })
  }
}
