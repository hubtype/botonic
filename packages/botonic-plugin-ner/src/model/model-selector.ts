import { ModelSelector } from '@botonic/nlp/lib/model/model-selector'
import { NerConfig } from '@botonic/nlp/lib/tasks/ner'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel } from '@tensorflow/tfjs'

import { NamedEntityRecognizer } from './ner'

export class NerModelSelector extends ModelSelector<
  NamedEntityRecognizer,
  NerConfig
> {
  static async build(
    locales: Locale[],
    modelsBaseUrl: string
  ): Promise<NerModelSelector> {
    const selector = new NerModelSelector(locales, modelsBaseUrl)
    return await selector.load()
  }

  protected createModel(
    config: NerConfig,
    model: LayersModel
  ): NamedEntityRecognizer {
    return new NamedEntityRecognizer(config, model)
  }
}
