import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'
import { Entity } from '@botonic/nlp/dist/tasks/ner/process/types'
import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { LayersModel } from '@tensorflow/tfjs'
import { Tensor3D } from '@tensorflow/tfjs-core/dist/tensor'

import { PredictionProcessor } from '../process/prediction-processor'
import { Processor } from '../process/processor'
import { getModelInfo } from '../utils/environment-utils'

export class ModelHandler {
  model: LayersModel
  config: NerConfig
  processor: Processor
  predictionProcessor: PredictionProcessor

  constructor() {
    // @ts-ignore
    return (async () => {
      await this.init()
      return this
    })()
  }

  private async init(): Promise<void> {
    const { model, config } = await getModelInfo()
    this.model = model
    this.config = config
    this.processor = new Processor(
      new Preprocessor(config.locale, config.maxLength),
      new Codifier(config.vocabulary, { isCategorical: false }),
      new Codifier(config.entities, { isCategorical: true })
    )
    this.predictionProcessor = new PredictionProcessor(config.entities)
  }

  recognizeEntities(text: string): Entity[] {
    const { sequence, input } = this.processor.generateInput(text)
    const prediction = this.model.predict(input) as Tensor3D
    const entities = this.predictionProcessor.process(sequence, prediction)
    return entities
  }
}
