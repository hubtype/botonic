import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from '../constants'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

interface AiCaptureResponseSuccess {
  success: true
  value: string
}

interface AiCaptureResponseFailure {
  success: false
}

type AiCaptureResponse = AiCaptureResponseSuccess | AiCaptureResponseFailure

export class CaptureUserInputApi {
  private hubtypeApiUrl: string
  private accessToken: string

  constructor(botContext: BotContext) {
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
  }

  async getAiCaptureResponse(
    userInput: string,
    fieldName: string,
    validationInstructions?: string
  ): Promise<AiCaptureResponse> {
    try {
      const data = {
        field_name: fieldName,
        validation_instructions: validationInstructions,
        user_input: userInput,
      }

      const aiCaptureResponse = await axios.post<AiCaptureResponse>(
        `${this.hubtypeApiUrl}/external/v1/capture_user_input/`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )

      return aiCaptureResponse.data
    } catch (error) {
      console.warn('Error getting ai/capture_user_input', error)
    }

    return {
      success: false,
    }
  }
}
