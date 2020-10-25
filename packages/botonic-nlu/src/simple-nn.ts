/* eslint-disable @typescript-eslint/unbound-method */
import {
  Sequential,
  sequential,
  train,
  layers,
  Tensor,
} from '@tensorflow/tfjs-node';
import { ModelParameters } from './types';

export class SimpleNN {
  private parameters: ModelParameters;
  private _wordEmbeddingsMatrix: Tensor;
  model: Sequential;

  constructor(parameters: ModelParameters, wordEmbeddingsMatrix: Tensor) {
    this.parameters = parameters;
    this._wordEmbeddingsMatrix = wordEmbeddingsMatrix;
    this._createModel();
  }

  private _createModel(): void {
    this.model = sequential();
    this._addEmbeddingLayer();
    this._addLSTMLayer();
    this._addDenseLayer();
    this._compile();
  }

  private _addEmbeddingLayer(): void {
    this.model.add(
      layers.embedding({
        inputDim: this._wordEmbeddingsMatrix.shape[0],
        outputDim: this._wordEmbeddingsMatrix.shape[1],
        inputLength: this.parameters.maxSeqLen,
        trainable: this.parameters.trainableEmbeddings,
        weights: [this._wordEmbeddingsMatrix],
      }),
    );
  }

  private _addLSTMLayer(): void {
    this.model.add(
      layers.lstm({
        units: 128,
        dropout: 0.3,
        recurrentDropout: 0.3,
      }),
    );
  }

  private _addDenseLayer(): void {
    this.model.add(
      layers.dense({
        units: this.parameters.intentsCount,
        activation: 'softmax',
      }),
    );
  }

  private _compile(): void {
    this.model.compile({
      optimizer: train.adam(this.parameters.learningRate),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }
}
