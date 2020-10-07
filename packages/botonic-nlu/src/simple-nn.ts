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
  private _learningRate: number;
  private _trainableEmbeddings: boolean;
  private _wordEmbeddingsMatrix: Tensor;
  private _intentsCount: number;
  private _maxSeqLen: number;
  private _model: Sequential;

  constructor(parameters: ModelParameters, wordEmbeddingsMatrix: Tensor) {
    this._maxSeqLen = parameters.maxSeqLen;
    this._learningRate = parameters.learningRate;
    this._intentsCount = parameters.intentsCount;
    this._trainableEmbeddings = parameters.trainableEmbeddings;
    this._wordEmbeddingsMatrix = wordEmbeddingsMatrix;
    this._createModel();
  }

  get model(): Sequential {
    this._model.summary();
    return this._model;
  }

  private _createModel(): void {
    this._model = sequential();
    this._addEmbeddingLayer();
    this._addLSTMLayer();
    this._addDenseLayer();
    this._compile();
  }

  private _addEmbeddingLayer(): void {
    this._model.add(
      layers.embedding({
        inputDim: this._wordEmbeddingsMatrix.shape[0],
        outputDim: this._wordEmbeddingsMatrix.shape[1],
        inputLength: this._maxSeqLen,
        trainable: this._trainableEmbeddings,
        weights: [this._wordEmbeddingsMatrix],
      }),
    );
  }
  private _addLSTMLayer(): void {
    this._model.add(
      layers.lstm({
        units: 128,
        dropout: 0.3,
        recurrentDropout: 0.3,
      }),
    );
  }
  private _addDenseLayer(): void {
    this._model.add(
      layers.dense({
        units: this._intentsCount,
        activation: 'softmax',
      }),
    );
  }

  private _compile(): void {
    this._model.compile({
      optimizer: train.adam(this._learningRate),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }
}
