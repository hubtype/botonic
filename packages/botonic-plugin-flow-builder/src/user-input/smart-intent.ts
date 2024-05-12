import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'

interface InferenceParam {
  name: string
  definition: string
}
export class SmartIntentsApi {
  public cmsApi: FlowBuilderApi
  public currentRequest: ActionRequest

  constructor(cmsApi: FlowBuilderApi, request: ActionRequest) {
    this.currentRequest = request
    this.cmsApi = cmsApi
  }

  async getNodeByInput(): Promise<HtSmartIntentNode | undefined> {
    const smartIntentNodes = this.cmsApi.getSmartIntentNodes()

    if (smartIntentNodes.length === 0) {
      return undefined
    }

    const params = this.getInferenceParams(smartIntentNodes)
    try {
      const response = await this.getInference(params)
      return smartIntentNodes.find(
        smartIntentNode =>
          smartIntentNode.content.title === response.data.intent_name
      )
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  private getInferenceParams(
    smartIntentNodes: HtSmartIntentNode[]
  ): InferenceParam[] {
    const intentsInferenceParams = smartIntentNodes.map(smartIntentNode => {
      return {
        name: smartIntentNode.content.title,
        definition: smartIntentNode.content.description,
      }
    })
    intentsInferenceParams.push({
      name: 'Other',
      definition: 'The text does not belong to any other intent.',
    })
    return intentsInferenceParams
  }

  private async getInference(
    inferenceParams: InferenceParam[]
  ): Promise<{ data: { intent_name: string } }> {
    return await axios({
      method: 'POST',
      url: `${process.env.HUBTYPE_API_URL}/external/v1/ai/smart_intents/inference/`,
      headers: {
        Authorization: `Bearer ${this.currentRequest.session._access_token}`,
        'Content-Type': 'application/json',
      },
      data: { text: this.currentRequest.input.data, intents: inferenceParams },
      timeout: 10000,
    })
  }
}
