import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { AccessToken } from './access-token'
import { GoogleTranslateApiService } from './google-translate-api-service'
import { LanguageDetector } from './language-detector'
import { PluginOptions } from './options'

export default class BotonicPluginGoogleTranslate implements Plugin {
  private readonly service: GoogleTranslateApiService
  private readonly languageDetector: LanguageDetector

  constructor(readonly options: PluginOptions) {
    this.service = new GoogleTranslateApiService(
      new AccessToken(this.options.credentials),
      this.options.credentials.projectId
    )
    this.languageDetector = new LanguageDetector(
      this.service,
      this.options.whitelist || []
    )
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const text = request.input.data
        request.session.__locale = await this.languageDetector.detect(text)
      }
    } catch (e) {
      console.error(
        'Error detecting language with Google Cloud Translate API',
        e
      )
    }
  }

  post(request: PluginPostRequest): void {}
}
