import { MediaFileLocale, TextLocale } from '../flow-builder-models'

export abstract class ContentFieldsBase {
  constructor(private readonly id: string) {}

  static getTextByLocale(locale: string, text: TextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getImageByLocale(locale: string, image: MediaFileLocale[]): string {
    const result = image.find(t => t.locale === locale)
    return result?.file ?? ''
  }
}
