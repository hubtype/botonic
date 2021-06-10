import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { AccessToken } from './access-token'
import { GoogleTranslateApiService } from './google-translate-api-service'
import { LanguageDetector } from './language-detector'
import { PluginOptions } from './options'
import { Translator } from './translator'

export default class BotonicPluginGoogleTranslate implements Plugin {
  private readonly translator: Translator
  private readonly languageDetector: LanguageDetector

  constructor(readonly options: PluginOptions) {
    const service = new GoogleTranslateApiService(
      new AccessToken(this.options.credentials),
      this.options.credentials.projectId
    )

    if (this.options.translation) {
      this.translator = new Translator(service)
    }

    if (this.options.languageDetection) {
      this.languageDetector = new LanguageDetector(
        service,
        this.options.languageDetection.whitelist
      )
    }
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const text = request.input.data

        if (this.options.translation) {
          request.session['translations'] = await this.translator.translate(
            text,
            this.options.translation.targets
          )
        }
        if (this.options.languageDetection) {
          request.session.__locale = await this.languageDetector.detect(text)
        }
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
