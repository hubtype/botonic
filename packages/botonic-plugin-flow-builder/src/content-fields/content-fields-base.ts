import {
  HtMediaFileLocale,
  HtQueueLocale,
  HtTextLocale,
  HtVideoLocale,
} from './hubtype-fields'

export abstract class ContentFieldsBase {
  constructor(public readonly id: string) {}

  static getTextByLocale(locale: string, text: HtTextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getAssetByLocale(locale: string, asset: HtMediaFileLocale[]): string {
    const result = asset.find(i => i.locale === locale)
    return result?.file ?? ''
  }

  static getVideoByLocale(locale: string, video: HtVideoLocale[]): string {
    const result = video.find(v => v.locale === locale)
    return result?.url ?? ''
  }

  static getQueueByLocale(
    locale: string,
    queues: HtQueueLocale[]
  ): HtQueueLocale | undefined {
    return queues.find(queue => queue.locale === locale)
  }
}
