import { PADDING_TOKEN } from '@botonic/nlp/lib/preprocess'
import {
  Entity,
  NEUTRAL_ENTITY,
  Prediction,
} from '@botonic/nlp/lib/tasks/ner/process'
import { Tensor3D } from '@tensorflow/tfjs'
export class PredictionProcessor {
  constructor(private readonly entities: string[]) {}

  process(sequence: string[], prediction: Tensor3D): Entity[] {
    const confidences = prediction.arraySync()[0]
    return this.getEntities(sequence, confidences)
  }

  private getEntities(sequence: string[], confidences: number[][]): Entity[] {
    const entities = sequence.map((token, idx) =>
      this.generateEntity(token, confidences[idx])
    )
    return this.filterEntities(entities)
  }

  private generateEntity(token: string, confidences: number[]): Entity {
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

  private filterEntities(entities: Entity[]): Entity[] {
    return entities.filter(
      entity => entity.text != PADDING_TOKEN && entity.label != NEUTRAL_ENTITY
    )
  }
}
