import {
  HubtypeSession,
  INPUT,
  Plugin,
  PluginPostRequest,
  PluginPreRequest,
} from '@botonic/core'

import { HubtypeBabelApiService } from './hubtype-babel-api-service'
import { PluginOptions } from './options'

export default class BotonicPluginHubtypeBabel implements Plugin {
  private readonly apiService: HubtypeBabelApiService

  constructor(private readonly options: PluginOptions) {
    this.apiService = new HubtypeBabelApiService(
      options.projectId,
      options.host
    )
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (
        request.input.type == INPUT.TEXT &&
        !request.input.payload &&
        request.input.data &&
        !this.isAutomaticBotMessage(request.input.data)
      ) {
        const sessionAuthToken = (request.session as HubtypeSession)
          ._access_token

        const authToken = this.options.authToken || sessionAuthToken

        if (!authToken) {
          if (!sessionAuthToken) {
            console.warn(
              'You might be using development environment. Remember that when testing locally, adding the authToken inside plugin options is mandatory.'
            )
          }
          throw new Error('Missing Authorization Token.')
        }

        const text = request.input.data
        const response = await this.apiService.inference(text, authToken)

        request.input.intent = response.data['intents'][0]['label']
        request.input.confidence = response.data['intents'][0]['confidence']
        request.input.intents = response.data['intents'].map(x => ({
          intent: x['label'],
          confidence: x['confidence'],
        }))
        request.input.hasSense = response.data['has_sense']
      }
    } catch (e) {
      console.error('Error during inference with Hubtype Babel', e)
    }
  }

  isAutomaticBotMessage(text: string): boolean {
    return text.toLowerCase().startsWith('[automatic bot message]')
  }

  async post(_request: PluginPostRequest) {}
}
