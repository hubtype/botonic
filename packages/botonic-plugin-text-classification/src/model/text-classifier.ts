import { Intent } from '@botonic/nlp/lib/tasks/text-classification/process/prediction-processor'
import { TextClassificationConfig } from '@botonic/nlp/lib/tasks/text-classification/storage/types'
import { LayersModel } from '@tensorflow/tfjs'

export class TextClassifier {
  constructor(
    private readonly config: TextClassificationConfig,
    private readonly model: LayersModel
  ) {}

  classify(text: string): Intent {
    return new Intent('test', 1)
  }
}
