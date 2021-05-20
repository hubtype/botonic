import { Locale } from '@botonic/nlp/lib/types'

import { IntentClassifier } from './intent-classifier'
import { ModelInfo } from './model-info'

export class ModelSelector {
  private models: { [locale: string]: IntentClassifier } = {}

  private constructor(
    readonly locales: Locale[],
    readonly modelsBaseUrl: string
  ) {}

  static async build(
    locales: Locale[],
    modelsBaseUrl: string
  ): Promise<ModelSelector> {
    const selector = new ModelSelector(locales, modelsBaseUrl)
    const modelsInfo = selector.loadModelsInfo()
    await selector.loadModels(modelsInfo)
    return selector
  }

  select(locale: Locale): IntentClassifier {
    return this.models[locale]
  }

  private loadModelsInfo(): ModelInfo[] {
    return this.locales.map(
      locale => new ModelInfo(locale, `${this.modelsBaseUrl}/${locale}`)
    )
  }

  private async loadModels(modelsInfo: ModelInfo[]): Promise<void> {
    for (const modelInfo of modelsInfo) {
      const locale = modelInfo.locale
      const config = await modelInfo.getConfig()
      const model = await modelInfo.getModel()
      this.models[locale] = new IntentClassifier(config, model)
    }
  }
}
