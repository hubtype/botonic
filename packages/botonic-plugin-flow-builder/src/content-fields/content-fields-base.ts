import {
  HtMediaFileLocale,
  HtTextLocale,
  HtVideoLocale,
} from './hubtype-fields'

export abstract class ContentFieldsBase {
  constructor(public readonly id: string) {}

  static getTextByLocale(locale: string, text: HtTextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getImageByLocale(locale: string, image: HtMediaFileLocale[]): string {
    const result = image.find(i => i.locale === locale)
    return result?.file ?? ''
  }

  static getVideoByLocale(locale: string, video: HtVideoLocale[]): string {
    const result = video.find(v => v.locale === locale)
    return result?.url ?? ''
  }
}
