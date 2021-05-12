import { Locale } from '@botonic/nlp/lib/types'

import { getModelUri } from '../utils/environment-utils'
import { ModelInfo } from './model-info'
import { IntentClassifier } from './text-classifier'

export class ModelSelector {
  private models: { [locale: string]: IntentClassifier } = {}

  private constructor(readonly locales: Locale[]) {}

  static async build(locales: Locale[]): Promise<ModelSelector> {
    const selector = new ModelSelector(locales)
    const modelsInfo = selector.loadModelsInfo()
    await selector.loadModels(modelsInfo)
    return selector
  }

  select(locale: Locale): IntentClassifier {
    return this.models[locale]
  }

  private loadModelsInfo(): ModelInfo[] {
    return this.locales.map(
      locale => new ModelInfo(locale, getModelUri(locale))
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
