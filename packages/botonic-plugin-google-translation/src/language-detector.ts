import {
  GoogleTranslationApiService,
  LanguageDetection,
} from './google-translate-api-service'

export class LanguageDetector {
  constructor(
    private readonly service: GoogleTranslationApiService,
    readonly whitelist?: string[]
  ) {}

  async detect(text: string): Promise<string | undefined> {
    let detectedLanguages = await this.service.detectLanguage(text)
    if (this.whitelist) {
      detectedLanguages = this.applyWhitelist(detectedLanguages)
    }
    detectedLanguages = this.sortByConfidence(detectedLanguages)
    if (detectedLanguages.length === 0) {
      return undefined
    }
    return detectedLanguages[0].languageCode
  }

  private applyWhitelist(
    detectedLanguages: LanguageDetection[]
  ): LanguageDetection[] {
    return detectedLanguages.filter(d =>
      this.whitelist!.includes(d.languageCode)
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
