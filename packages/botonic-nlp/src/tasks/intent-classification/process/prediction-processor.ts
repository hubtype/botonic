import { OutputData } from './types'

export class Intent {
  constructor(readonly label: string, readonly confidence: number) {}
}

export class PredictionProcessor {
  constructor(private readonly intents: string[]) {}

  process(prediction: OutputData): Intent[] {
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
