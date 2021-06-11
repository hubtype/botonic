import {
  GoogleTranslateApiService,
  LanguageDetection,
} from './google-translate-api-service'

export class LanguageDetector {
  constructor(
    private readonly service: GoogleTranslateApiService,
    readonly whitelist: string[] = [],
    readonly defaultLanguage = 'en'
  ) {}

  async detect(text: string): Promise<string> {
    let detectedLanguages = await this.service.detectLanguage(text)
    if (this.whitelist.length != 0) {
      detectedLanguages = this.applyWhitelist(detectedLanguages)
    }
    detectedLanguages = this.sortByConfidence(detectedLanguages)
    if (detectedLanguages.length == 0) {
      return this.defaultLanguage
    }
    return detectedLanguages[0].languageCode
  }

  private applyWhitelist(
    detectedLanguages: LanguageDetection[]
  ): LanguageDetection[] {
    return detectedLanguages.filter(d =>
      this.whitelist.includes(d.languageCode)
    )
  }

  private sortByConfidence(
    detectedLanguages: LanguageDetection[]
  ): LanguageDetection[] {
    return detectedLanguages.sort((a, b) =>
      a.confidence < b.confidence ? 1 : -1
    )
  }
}
