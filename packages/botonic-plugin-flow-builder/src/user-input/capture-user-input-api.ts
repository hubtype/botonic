import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { FlowCaptureUserInput } from '../content-fields'
import {
  HtAiValidationType,
  HtCaptureUserInputNode,
} from '../content-fields/hubtype-fields'
import { inputHasTextData } from '../utils'

interface AiCaptureResponseSuccess {
  success: true
  value: string
}

interface AiCaptureResponseFailure {
  success: false
}

type AiCaptureResponse = AiCaptureResponseSuccess | AiCaptureResponseFailure

export class CaptureUserInputApi {
  private cmsApi: FlowBuilderApi
  private request: ActionRequest

  constructor(cmsApi: FlowBuilderApi, request: ActionRequest) {
    this.cmsApi = cmsApi
    this.request = request
  }

  async getNextNodeId(): Promise<string | undefined> {
    if (
      inputHasTextData(this.request.input) &&
      this.cmsApi.shouldCaptureUserInput()
    ) {
      const captureUserInputNode = this.cmsApi.getCaptureUserInputNode()
      if (!captureUserInputNode) {
        return undefined
      }
      const captureUserInput =
        FlowCaptureUserInput.fromHubtypeCMS(captureUserInputNode)

      if (captureUserInput.aiValidationType === HtAiValidationType.NONE) {
        this.request.session.user.extra_data[
          captureUserInputNode.content.field_name
        ] = this.request.input.data
        return captureUserInput.captureSuccessId
      }

      const aiCaptureResponse =
        await this.getAiCaptureResponse(captureUserInputNode)
      this.cmsApi.setCaptureUserInputId(undefined)
      if (!aiCaptureResponse.success) {
        return captureUserInput.captureFailId
      }

      this.request.session.user.extra_data[
        captureUserInputNode.content.field_name
      ] = aiCaptureResponse.value
      return captureUserInput.captureSuccessId
    }
    return undefined
  }

  async getAiCaptureResponse(
    captureUserInputNode: HtCaptureUserInputNode
  ): Promise<AiCaptureResponse> {
    try {
      const url = `${process.env.HUBTYPE_API_URL}/external/v1/capture_user_input/`
      const data = {
        field_name: captureUserInputNode.content.field_name,
        validation_instructions:
          captureUserInputNode.content.ai_validation_instructions,
        user_input: this.request.input.data,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.request.session._access_token}`,
        },
      }

      const aiCaptureResponse = await axios.post<AiCaptureResponse>(
        url,
        data,
        config
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
