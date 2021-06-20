import { ModelSelector } from '@botonic/nlp/lib/model/model-selector'
import { IntentClassifierConfig } from '@botonic/nlp/lib/tasks/intent-classification'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel } from '@tensorflow/tfjs'

import { IntentClassifier } from './intent-classifier'

export class IntentModelSelector extends ModelSelector<
  IntentClassifier,
  IntentClassifierConfig
> {
  static async build(
    locales: Locale[],
    modelsBaseUrl: string
  ): Promise<IntentModelSelector> {
    const selector = new IntentModelSelector(locales, modelsBaseUrl)
    return await selector.load()
  }

  protected createModel(
    config: IntentClassifierConfig,
    model: LayersModel
  ): IntentClassifier {
    return new IntentClassifier(config, model)
  }
}
