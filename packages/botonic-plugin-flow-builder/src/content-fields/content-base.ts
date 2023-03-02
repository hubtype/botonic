import { HtTextLocale } from '../hubtype-models'
import { FlowCarousel } from './carousel'
import { FlowImage } from './image'
import { FlowText } from './text'

export abstract class ContentFieldsBase {
  constructor(private readonly id: string) {}

  static getTextByLocale(locale: string, text: HtTextLocale[]) {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }
}

export type FlowContent = FlowText | FlowImage | FlowCarousel
