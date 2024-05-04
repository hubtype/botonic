import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { FlowBuilderApi } from '../api'
import { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'

export async function getSmartIntentNodeByInput(
  cmsApi: FlowBuilderApi,
  request: ActionRequest
): Promise<HtSmartIntentNode | undefined> {
  const smartIntentNodes = cmsApi.getSmartIntentNodes()
  if (smartIntentNodes.length === 0) {
    return undefined
  }

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

  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.HUBTYPE_API_URL}/external/v1/ai/smart_intents/inference/`,
      headers: {
        Authorization: `Bearer ${request.session._access_token}`,
        'Content-Type': 'application/json',
      },
      data: { text: request.input.data, intents: intentsInferenceParams },
      timeout: 10000,
    })
    return smartIntentNodes.find(
      smartIntentNode =>
        smartIntentNode.content.title === response.data.intent_name
    )
  } catch (e) {
    console.error(e)
    return undefined
  }
}
