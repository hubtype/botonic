import { HtMediaFileLocale, HtTextLocale } from '../hubtype-models'
import { FlowCarousel } from './carousel'
import { FlowImage } from './image'
import { FlowText } from './text'

export abstract class ContentFieldsBase {
  constructor(private readonly id: string) {}

  static getTextByLocale(locale: string, text: HtTextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getImageByLocale(locale: string, image: HtMediaFileLocale[]): string {
    const result = image.find(t => t.locale === locale)
    return result?.file ?? ''
  }
}

export type FlowContent = FlowText | FlowImage | FlowCarousel
