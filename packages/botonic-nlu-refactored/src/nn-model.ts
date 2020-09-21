import { HyperParameters, Word2Index, ReversedLabels } from './types';
import * as tf from '@tensorflow/tfjs-node';
export class NNModel {
  private _params: HyperParameters;
  private _trainableEmbeddings: boolean;
  private _wordEmbeddingMatrix?: any;
  private _vocabulary: Word2Index;
  private _reversedLabels: ReversedLabels;
  private _sequenceLength: number;
  private _model: tf.Sequential;
  constructor(
    sequenceLength: number,
    vocabulary: Word2Index,
    intents: ReversedLabels,
    params: HyperParameters,
    trainableEmbeddings: boolean,
    wordEmbeddingMatrix?: any,
  ) {
    this._sequenceLength = sequenceLength;
    this._vocabulary = vocabulary;
    this._reversedLabels = intents;
    this._params = params;
    this._trainableEmbeddings = trainableEmbeddings;
    this._wordEmbeddingMatrix = wordEmbeddingMatrix;
    this._initModel();
  }
  get model(): tf.Sequential {
    this._model.summary();
    this._model.compile({
      optimizer: tf.train.adam(this._params.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    return this._model;
  }
  private _initModel(): void {
    this._model = tf.sequential();
    this._addEmbeddingLayer();
    this._addLSTMLayer();
    this._addDenseLayer();
  }
  private _addEmbeddingLayer(): void {
    this._model.add(
      tf.layers.embedding({
        inputDim: this._wordEmbeddingMatrix.shape[0],
        outputDim: this._wordEmbeddingMatrix.shape[1],
        inputLength: this._sequenceLength,
        trainable: this._trainableEmbeddings,
        weights: [this._wordEmbeddingMatrix],
      }),
    );
  }
  private _addLSTMLayer(): void {
    this._model.add(
      tf.layers.lstm({
        units: this._params.units,
        dropout: this._params.dropoutRegularization,
        recurrentDropout: this._params.dropoutRegularization,
      }),
    );
  }
  private _addDenseLayer(): void {
    this._model.add(
      tf.layers.dense({
        units: Object.keys(this._reversedLabels).length,
        activation: 'softmax',
      }),
    );
  }
}
