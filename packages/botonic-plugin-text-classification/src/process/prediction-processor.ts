import { Intent } from '@botonic/nlp/lib/tasks/text-classification/process/prediction-processor'
import type { Tensor3D } from '@tensorflow/tfjs'

export class PredictionProcessor {
  constructor(private readonly classes: string[]) {}

  process(sequence: string[], prediction: Tensor3D): Intent[] {
    //TODO: pending to be implemented
    return null
  }
}
