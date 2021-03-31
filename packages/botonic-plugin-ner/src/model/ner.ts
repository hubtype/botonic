import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'
import { Entity } from '@botonic/nlp/dist/tasks/ner/process/types'
import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { LayersModel, Tensor3D } from '@tensorflow/tfjs'
import { default as fetch } from 'node-fetch'

import { PredictionProcessor } from '../postprocess/prediction-processor'
import { InputGenerator } from '../preprocess/input-generator'

// Support for fetch API in Node (Lambda Env): https://stackoverflow.com/a/48433898
// @ts-ignore
global.fetch = fetch

export class NamedEntityRecognizer {
  private inputGenerator: InputGenerator
  private predictionProcessor: PredictionProcessor

  constructor(
    private readonly config: NerConfig,
    private readonly model: LayersModel
  ) {
    this.inputGenerator = new InputGenerator(
      new Preprocessor(this.config.locale, this.config.maxLength),
      new Codifier(this.config.vocabulary, { isCategorical: false })
    )
    this.predictionProcessor = new PredictionProcessor(this.config.entities)
  }

  recognize(text: string): Entity[] {
    const { sequence, input } = this.inputGenerator.generate(text)
    const prediction = this.model.predict(input) as Tensor3D
    const entities = this.predictionProcessor.process(sequence, prediction)
    return entities
  }
}
