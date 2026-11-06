import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HubtypeClientBase } from './hubtype-client-base'

interface AiCaptureResponseSuccess {
  success: true
  value: string
}

interface AiCaptureResponseFailure {
  success: false
}

type AiCaptureResponse = AiCaptureResponseSuccess | AiCaptureResponseFailure

export class CaptureUserInputClient extends HubtypeClientBase {
  constructor(botContext: BotContext) {
    super(botContext)
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
