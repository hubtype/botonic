import { PADDING_TOKEN } from '@botonic/nlp/dist/preprocess/constants'
import { Entity, Prediction } from '@botonic/nlp/dist/tasks/ner/process/types'
import { Tensor3D } from '@tensorflow/tfjs'

export class PredictionProcessor {
  constructor(private readonly entities: string[]) {}

  process(sequence: string[], prediction: Tensor3D): Entity[] {
    const confidences = prediction.arraySync()[0]
    const entities = sequence.map((token, idx) =>
      this.getEntity(token, confidences[idx])
    )
    return entities.filter(e => e.text != PADDING_TOKEN)
  }

  private getEntity(token: string, confidences: number[]): Entity {
    const confidence = Math.max(...confidences)
    const label = this.entities[confidences.indexOf(confidence)]
    const predictions = this.getPredictions(confidences)
    return { text: token, label, confidence, predictions }
  }

  private getPredictions(confidences: number[]): Prediction[] {
    return confidences.map((c, i) => {
      return { label: this.entities[i], confidence: c }
    })
  }
}
