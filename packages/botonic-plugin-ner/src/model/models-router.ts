import { Entity } from '@botonic/nlp/dist/tasks/ner/process/types'
import { Locale } from '@botonic/nlp/dist/types'

import { ModelInfoPromise } from '../types'
import { getModelInfo } from '../utils/environment-utils'
import { detectLocale } from '../utils/locale-utils'
import { NamedEntityRecognizer } from './ner'

type ModelInfoPerLocale = { [locale: string]: ModelInfoPromise }

export class ModelsRouter {
  private recognizers: { [locale: string]: NamedEntityRecognizer } = {}

  private constructor(readonly locales: Locale[]) {}

  private async init(): Promise<void> {
    const modelsInfo = this.getModelInfoForLocales()
    await this.loadRecognizers(modelsInfo)
  }

  private getModelInfoForLocales(): ModelInfoPerLocale {
    const modelsInfo: ModelInfoPerLocale = {}
    for (const locale of this.locales) {
      modelsInfo[locale] = getModelInfo(locale)
    }
    return modelsInfo
  }

  private async loadRecognizers(modelsInfo: ModelInfoPerLocale): Promise<void> {
    for (const locale of this.locales) {
      const modelInfo = modelsInfo[locale]
      this.recognizers[locale] = await NamedEntityRecognizer.load(modelInfo)
    }
  }

  static async build(locales: Locale[]): Promise<ModelsRouter> {
    const router = new ModelsRouter(locales)
    await router.init()
    return router
  }

  recognizeEntities(text: string): Entity[] {
    const locale = detectLocale(text, this.locales)
    const ner = this.getRecognizer(locale)
    return ner.recognize(text)
  }

  private getRecognizer(locale: Locale): NamedEntityRecognizer {
    if (!this.isRecognizerReady(locale)) {
      throw new Error('NER Model not ready.')
    }
    return this.recognizers[locale]
  }

  private isRecognizerReady(locale: Locale): boolean {
    return Boolean(this.recognizers[locale])
  }
}
