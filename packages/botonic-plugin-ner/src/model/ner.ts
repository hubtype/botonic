import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import { Entity } from '@botonic/nlp/lib/tasks/ner/process/types'
import { NerConfig } from '@botonic/nlp/lib/tasks/ner/storage/types'
import { LayersModel, Tensor3D } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../process/prediction-processor'
import { TextProcessor } from '../process/text-processor'

export class NamedEntityRecognizer {
  private readonly textProcessor: TextProcessor
  private readonly predictionProcessor: PredictionProcessor

  constructor(
    private readonly config: NerConfig,
    private readonly model: LayersModel
  ) {
    this.textProcessor = new TextProcessor(
      this.config.vocabulary,
      new Preprocessor(this.config.locale, this.config.maxLength)
    )
    this.predictionProcessor = new PredictionProcessor(this.config.entities)
  }

  recognize(text: string): Entity[] {
    const { sequence, input } = this.textProcessor.process(text)
    const prediction = this.model.predict(input) as Tensor3D
    const entities = this.predictionProcessor.process(sequence, prediction)
    return entities
  }
}
