import {
  MediaFileLocale,
  TextLocale,
  VideoLocale,
} from '../flow-builder-models'

export abstract class ContentFieldsBase {
  constructor(public readonly id: string) {}

  static getTextByLocale(locale: string, text: TextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getImageByLocale(locale: string, image: MediaFileLocale[]): string {
    const result = image.find(i => i.locale === locale)
    return result?.file ?? ''
  }

  static getVideoByLocale(locale: string, video: VideoLocale[]): string {
    const result = video.find(v => v.locale === locale)
    return result?.url ?? ''
  }
}
