import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'
import { Intent } from '@botonic/nlp/lib/tasks/intent-classification/process/prediction-processor'
import type { IntentClassificationConfig } from '@botonic/nlp/lib/tasks/intent-classification/storage/types'
import type { Tensor2D } from '@tensorflow/tfjs'
import { LayersModel } from '@tensorflow/tfjs'

import { PredictionProcessor } from '../process/prediction-processor'
import { TextProcessor } from '../process/text-processor'

export class IntentClassifier {
  private readonly textProcessor: TextProcessor
  private readonly predictionProcessor: PredictionProcessor

  constructor(
    private readonly config: IntentClassificationConfig,
    private readonly model: LayersModel
  ) {
    this.textProcessor = new TextProcessor(
      this.config.vocabulary,
      new Preprocessor(this.config.locale, this.config.maxLength)
    )
    this.predictionProcessor = new PredictionProcessor(this.config.classes)
  }

  classify(text: string): Intent[] {
    const { input } = this.textProcessor.process(text)
    const prediction = this.model.predict(input) as Tensor2D
    const intents = this.predictionProcessor.process(prediction)
    return intents
  }
}
