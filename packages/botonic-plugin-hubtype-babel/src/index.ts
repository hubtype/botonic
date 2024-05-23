import { INPUT, Plugin, PluginPreRequest } from '@botonic/core'

import { HubtypeBabelApiService } from './hubtype-babel-api-service'
import { PluginHubtypeBabelOptions } from './options'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginHubtypeBabel implements Plugin {
  private readonly apiService: HubtypeBabelApiService
  private readonly includeHasSense: boolean
  readonly automaticBotMessagePrefix: string

  constructor(private readonly options: PluginHubtypeBabelOptions) {
    this.apiService = new HubtypeBabelApiService(options.projectId)
    this.includeHasSense = options.includeHasSense || false
    this.automaticBotMessagePrefix =
      options.automaticBotMessagePrefix || '[Automatic Bot Message]'
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (
        request.input.type == INPUT.TEXT &&
        !request.input.payload &&
        request.input.data &&
        !this.isAutomaticBotMessage(request.input.data)
      ) {
        const sessionAuthToken = request.session._access_token

        const authToken = isProd ? sessionAuthToken : this.options.authToken

        if (!authToken) {
          if (!sessionAuthToken) {
            console.warn(
              'You might be using development environment. Remember that when testing locally, adding the authToken inside plugin options is mandatory.'
            )
          }
          throw new Error('Missing Authorization Token.')
        }

        const text = request.input.data
        const response = await this.apiService.inference(
          text,
          authToken,
          this.includeHasSense
        )

        request.input.intent = response.data['intents'][0]['label']
        request.input.confidence = response.data['intents'][0]['confidence']
        request.input.intents = response.data['intents'].map(x => ({
          intent: x['label'],
          confidence: x['confidence'],
        }))

        if (this.includeHasSense) {
          request.input.hasSense = response.data['has_sense']
        }
      }
    } catch (e) {
      console.error('Error during inference with Hubtype Babel', e)
    }
  }

  isAutomaticBotMessage(text: string): boolean {
    return text
      .toLowerCase()
      .startsWith(this.automaticBotMessagePrefix.toLowerCase())
  }
}

export { PluginHubtypeBabelOptions } from './options'
