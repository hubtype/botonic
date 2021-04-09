import { OutputData } from './types'

export class Intent {
  constructor(readonly label: string, readonly confidence: number) {}
}

export class PredictionProcessor {
  constructor(private readonly classes: string[]) {}

  process(prediction: OutputData): Intent[] {
    const confidences = prediction.arraySync()[0]
    const intents = this.generateIntents(confidences)
    return this.sortIntentsByConfidence(intents)
  }

  private generateIntents(confidences: number[]): Intent[] {
    return confidences.map(
      (confidence, idx) => new Intent(this.classes[idx], confidence)
    )
  }

  private sortIntentsByConfidence(intents: Intent[]): Intent[] {
    return intents.sort((a, b) => (a.confidence > b.confidence ? -1 : 1))
  }
}
