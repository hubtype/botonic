import {
  LayersModel,
  loadLayersModel,
  Sequential,
  Tensor,
} from '@tensorflow/tfjs-node'
import { accuracyScore } from 'machinelearn/metrics'

import { WordEmbeddingsManager } from './embeddings/word-embeddings-manager'
import { SimpleNN } from './simple-nn'
import {
  EncodedPrediction,
  InputSet,
  ModelParameters,
  ModelTemplatesType,
  OutputSet,
  TrainingParameters,
  WordEmbeddingsConfig,
} from './types'

export class ModelManager {
  protected constructor(readonly model: Sequential | LayersModel) {}

  static fromModel(model: Sequential | LayersModel): ModelManager {
    return new ModelManager(model)
  }

  static async fromModelPath(path: string): Promise<ModelManager> {
    const model = await loadLayersModel(`file://${path}`)
    return new ModelManager(model)
  }

  static async fromModelTemplate(
    template: ModelTemplatesType,
    wordEmbeddingsConfig: WordEmbeddingsConfig,
    parameters: ModelParameters
  ): Promise<ModelManager> {
    const wordEmbeddingsManager = await WordEmbeddingsManager.withConfig(
      wordEmbeddingsConfig
    )
    const wordEmbeddingsMatrix = wordEmbeddingsManager.matrix

    switch (template) {
      case ModelTemplatesType.SIMPLE_NN:
      default:
        return new ModelManager(
          new SimpleNN(parameters, wordEmbeddingsMatrix).model
        )
    }
  }

  async train(params: TrainingParameters): Promise<void> {
    await this.model.fit(params.x, params.y, {
      epochs: params.epochs,
      batchSize: params.batchSize,
      validationSplit: params.validationSplit,
    })
  }

  predictProbabilities(input: Tensor): EncodedPrediction[] {
    const confidences = Array.from(
      (this.model.predict(input) as Tensor).dataSync()
    )
    return confidences.map((confidence: number, intentId: number) => ({
      intentId,
      confidence,
    }))
  }

  predict(input: Tensor): number {
    const probabilities = (this.model.predict(
      input
    ) as Tensor).arraySync() as number[][]
    const intentId = probabilities[0].indexOf(Math.max(...probabilities[0]))
    return intentId
  }

  evaluate(x: InputSet, y: OutputSet): number {
    const prediction = (this.model.predict(
      x
    ) as Tensor).arraySync() as number[][]

    const yPred: number[] = prediction.map(confidences =>
      confidences.indexOf(Math.max(...confidences))
    )

    const yTrue = y.arraySync() as number[]

    const accuracy = accuracyScore(yTrue, yPred)
    return accuracy
  }

  async saveModel(modelDir: string): Promise<void> {
    await this.model.save(`file://${modelDir}`)
  }
}
