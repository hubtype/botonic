import { Intent } from '@botonic/nlp/lib/tasks/intent-classification/process/prediction-processor'
import type { Tensor2D } from '@tensorflow/tfjs'

export class PredictionProcessor {
  constructor(private readonly intents: string[]) {}

  process(prediction: Tensor2D): Intent[] {
    const confidences = prediction.arraySync()[0]
    const intents = this.createIntents(confidences)
    return this.sortIntentsByConfidence(intents)
  }

  private createIntents(confidences: number[]): Intent[] {
    return confidences.map(
      (confidence, idx) => new Intent(this.intents[idx], confidence)
    )
  }

  private sortIntentsByConfidence(intents: Intent[]): Intent[] {
    return intents.sort((a, b) => (a.confidence > b.confidence ? -1 : 1))
  }
}
