import { GoogleTranslateApiService } from './google-translate-api-service'

export type Translations = { [languageCode: string]: string }

export class Translator {
  constructor(private readonly service: GoogleTranslateApiService) {}

  async translate(text: string, targets: string[]): Promise<Translations> {
    const responses = await Promise.all(
      targets.map(t => this.service.translateText(text, t))
    )
    const translations = {}
    responses.forEach((r, i) => (translations[targets[i]] = r.translatedText))
    return translations
  }
}
