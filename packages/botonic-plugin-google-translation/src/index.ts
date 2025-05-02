import { INPUT, Plugin, PluginPreRequest } from '@botonic/core'

import { AccessToken } from './access-token'
import { GoogleTranslationApiService } from './google-translate-api-service'
import { LanguageDetector } from './language-detector'
import { PluginOptions } from './options'
import { Translator } from './translator'

export default class BotonicPluginGoogleTranslate implements Plugin {
  private readonly translator: Translator
  private readonly languageDetector: LanguageDetector

  constructor(readonly options: PluginOptions) {
    const service = new GoogleTranslationApiService(
      new AccessToken(this.options.credentials),
      this.options.credentials.projectId
    )
    this.translator = new Translator(service)
    this.languageDetector = new LanguageDetector(
      service,
      this.options.whitelist
    )
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (
        request.input.type === INPUT.TEXT &&
        request.input.data &&
        !request.input.payload
      ) {
        const text = request.input.data
        if (this.options.translateTo) {
          const translations = await this.translator.translate(
            text,
            this.options.translateTo
          )
          request.input.translations = translations
        }
        const detectedLanguage = await this.languageDetector.detect(text)
        request.input.language = detectedLanguage || request.getUserLocale()
      }
    } catch (e) {
      console.error(
        'Error detecting language with Google Cloud Translate API',
        e
      )
    }
  }
}
