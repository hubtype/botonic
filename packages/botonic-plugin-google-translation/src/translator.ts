import { Translations } from '@botonic/core'

import { GoogleTranslationApiService } from './google-translate-api-service'

export class Translator {
  constructor(private readonly service: GoogleTranslationApiService) {}

  async translate(text: string, targets: string[]): Promise<Translations> {
    const responses = await Promise.all(
      targets.map(t => this.service.translateText(text, t))
    )
    return Object.assign(
      {},
      ...responses.map((r, i) => ({ [targets[i]]: r.translatedText }))
    )
  }
}
