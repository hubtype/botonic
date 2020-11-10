/* eslint-disable @typescript-eslint/unbound-method */
import {
  layers,
  Sequential,
  sequential,
  Tensor,
  train,
} from '@tensorflow/tfjs-node'

import { ModelParameters } from './types'

export class SimpleNN {
  model: Sequential

  constructor(
    private parameters: ModelParameters,
    private wordEmbeddingsMatrix: Tensor
  ) {
    this._createModel()
  }

  private _createModel(): void {
    this.model = sequential()
    this._addEmbeddingLayer()
    this._addLSTMLayer()
    this._addDenseLayer()
    this._compile()
    this.model.summary()
  }

  private _addEmbeddingLayer(): void {
    this.model.add(
      layers.embedding({
        inputDim: this.wordEmbeddingsMatrix.shape[0],
        outputDim: this.wordEmbeddingsMatrix.shape[1],
        inputLength: this.parameters.maxSeqLen,
        trainable: this.parameters.trainableEmbeddings,
        weights: [this.wordEmbeddingsMatrix],
      })
    )
  }

  private _addLSTMLayer(): void {
    this.model.add(
      layers.lstm({
        units: 128,
        dropout: 0.3,
        recurrentDropout: 0.3,
      })
    )
  }

  private _addDenseLayer(): void {
    this.model.add(
      layers.dense({
        units: this.parameters.intentsCount,
        activation: 'softmax',
      })
    )
  }

  private _compile(): void {
    this.model.compile({
      optimizer: train.adam(this.parameters.learningRate),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy'],
    })
  }
}
