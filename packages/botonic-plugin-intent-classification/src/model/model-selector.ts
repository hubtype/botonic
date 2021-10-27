import { ModelSelector } from '@botonic/nlp/lib/model/model-selector'
import { IntentClassifierConfig } from '@botonic/nlp/lib/tasks/intent-classification'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel } from '@tensorflow/tfjs'

import { IntentClassifier } from './intent-classifier'

export class IntentModelSelector extends ModelSelector<
  IntentClassifier,
  IntentClassifierConfig
> {
  static async build(locales: Locale[]): Promise<IntentModelSelector> {
    const baseUrl: string =
      (process.env.STATIC_URL && `${process.env.STATIC_URL}/assets/tasks/`) ||
      // @ts-ignore
      (typeof MODELS_BASE_URL !== 'undefined' && MODELS_BASE_URL) ||
      process.env.MODELS_BASE_URL
    const intentModelsUrl = `${baseUrl}/intent-classification/models`
    const selector = new IntentModelSelector(locales, intentModelsUrl)
    return await selector.load()
  }

  protected createModel(
    config: IntentClassifierConfig,
    model: LayersModel
  ): IntentClassifier {
    return new IntentClassifier(config, model)
  }
}
