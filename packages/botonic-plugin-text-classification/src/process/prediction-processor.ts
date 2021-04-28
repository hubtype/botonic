import { Intent } from '@botonic/nlp/lib/tasks/text-classification/process/prediction-processor'
import type { Tensor2D } from '@tensorflow/tfjs'

export class PredictionProcessor {
  constructor(private readonly classes: string[]) {}

  process(prediction: Tensor2D): Intent[] {
    //TODO: pending to be implemented
    return null
  }
}
