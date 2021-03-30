import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'
import { Entity } from '@botonic/nlp/dist/tasks/ner/process/types'
import { NerConfig } from '@botonic/nlp/dist/tasks/ner/storage/types'
import { LayersModel, Tensor3D } from '@tensorflow/tfjs'
import { default as fetch } from 'node-fetch'

import { PredictionProcessor } from '../postprocess/prediction-processor'
import { InputGenerator } from '../preprocess/input-generator'
import { ModelInfoPromise } from '../types'

// Support for fetch API in Node (Lambda Env): https://stackoverflow.com/a/48433898
// @ts-ignore
global.fetch = fetch

export class NamedEntityRecognizer {
  inputGenerator: InputGenerator
  predictionProcessor: PredictionProcessor

  private constructor(
    private readonly model: LayersModel,
    private readonly config: NerConfig
  ) {
    this.inputGenerator = new InputGenerator(
      new Preprocessor(this.config.locale, this.config.maxLength),
      new Codifier(this.config.vocabulary, { isCategorical: false })
    )
    this.predictionProcessor = new PredictionProcessor(this.config.entities)
  }

  static async load(
    modelInfoPromise: ModelInfoPromise
  ): Promise<NamedEntityRecognizer> {
    const model = await modelInfoPromise.model
    const config = (await modelInfoPromise.config).data
    return new NamedEntityRecognizer(model, config)
  }

  recognize(text: string): Entity[] {
    const { sequence, input } = this.inputGenerator.generate(text)
    const prediction = this.model.predict(input) as Tensor3D
    const entities = this.predictionProcessor.process(sequence, prediction)
    return entities
  }
}
