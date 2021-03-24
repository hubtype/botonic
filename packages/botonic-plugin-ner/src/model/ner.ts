import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'
import { Entity } from '@botonic/nlp/dist/tasks/ner/process/types'
import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { Locale } from '@botonic/nlp/dist/types'
import { LayersModel, Tensor3D } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../postprocess/prediction-processor'
import { InputGenerator } from '../preprocess/input-generator'
import { getModelInfo } from '../utils/environment-utils'

export class NamedEntityRecognizer {
  model: LayersModel
  config: NerConfig
  inputGenerator: InputGenerator
  predictionProcessor: PredictionProcessor

  constructor(readonly locale: Locale) {
    // @ts-ignore
    return (async () => {
      await this.init()
      return this
    })()
  }

  private async init(): Promise<void> {
    const { model, config } = await getModelInfo(this.locale)
    this.model = model
    this.config = config
    this.inputGenerator = new InputGenerator(
      new Preprocessor(config.locale, config.maxLength),
      new Codifier(config.vocabulary, { isCategorical: false })
    )
    this.predictionProcessor = new PredictionProcessor(config.entities)
  }

  recognize(text: string): Entity[] {
    const { sequence, input } = this.inputGenerator.generate(text)
    const prediction = this.model.predict(input) as Tensor3D
    const entities = this.predictionProcessor.process(sequence, prediction)
    return entities
  }
}
