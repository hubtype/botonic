import { GoogleTranslateApiService } from './google-translate-api-service'

export type Translations = { [languageCode: string]: string }

export class Translator {
  constructor(private readonly service: GoogleTranslateApiService) {}

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
