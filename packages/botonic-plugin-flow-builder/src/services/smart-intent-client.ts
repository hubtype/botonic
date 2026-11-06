import type { BotContext } from '@botonic/core'
import axios from 'axios'

import type { SmartIntentResponse } from '../types'
import { HubtypeClientBase } from './hubtype-client-base'

export interface SmartIntentsInferenceParams {
  bot_id: string
  text: string
  num_smart_intents_to_use?: number
  use_latest: boolean
  disabled_smart_intent_titles: string[]
}

export class SmartIntentsClient extends HubtypeClientBase {
  constructor(botContext: BotContext) {
    super(botContext)
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
