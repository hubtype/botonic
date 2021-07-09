import { ModelSelector } from '@botonic/nlp/lib/model/model-selector'
import { NerConfig } from '@botonic/nlp/lib/tasks/ner'
import { Locale } from '@botonic/nlp/lib/types'
import { LayersModel } from '@tensorflow/tfjs'

import { NamedEntityRecognizer } from './ner'

export class NerModelSelector extends ModelSelector<
  NamedEntityRecognizer,
  NerConfig
> {
  static async build(locales: Locale[]): Promise<NerModelSelector> {
    const baseUrl: string =
      // @ts-ignore
      (typeof MODELS_BASE_URL !== 'undefined' && MODELS_BASE_URL) ||
      process.env.MODELS_BASE_URL
    const nerModelsUrl = `${baseUrl}/ner/models`
    const selector = new NerModelSelector(locales, nerModelsUrl)
    return await selector.load()
  }

  protected createModel(
    config: NerConfig,
    model: LayersModel
  ): NamedEntityRecognizer {
    return new NamedEntityRecognizer(config, model)
  }
}
