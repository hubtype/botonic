import {
  Sequential,
  LayersModel,
  loadLayersModel,
  Tensor,
} from '@tensorflow/tfjs-node';
import { SimpleNN } from './simpleNN';
import { WordEmbeddingsManager } from './embeddings/word-embeddings-manager';
import {
  EncodedPrediction,
  WordEmbeddingsConfig,
  InputSet,
  OutputSet,
  ModelParameters,
  TrainingParameters,
} from './types';
import { accuracyScore } from 'machinelearn/metrics';

export class ModelManager {
  private _model: Sequential | LayersModel;
  private _wordEmbeddingsManager: WordEmbeddingsManager;

  constructor() {
    this._wordEmbeddingsManager = new WordEmbeddingsManager();
  }

  async loadModel(modelPath: string) {
    this._model = await loadLayersModel(`file://${modelPath}`);
  }

  async createModel(
    wordEmbeddingsConfig: WordEmbeddingsConfig,
    parameters: ModelParameters,
  ) {
    await this._wordEmbeddingsManager.generateWordEmbeddingsMatrix(
      wordEmbeddingsConfig,
    );
    const wordEmbeddingsMatrix: Tensor = this._wordEmbeddingsManager
      .wordEmbeddingsMatrix;

    this._model = new SimpleNN(parameters, wordEmbeddingsMatrix).model;
  }

  async train(parameters: TrainingParameters) {
    const { X, y, batchSize, epochs, validationSplit } = parameters;
    await this._model.fit(X, y, {
      epochs: epochs,
      batchSize: batchSize,
      validationSplit: validationSplit,
    });
  }

  predictProbabilities(input: Tensor): EncodedPrediction {
    let prediction: EncodedPrediction = [];
    const confidences = (this._model.predict(input) as Tensor).dataSync();
    confidences.forEach((confidence: number, intentId: number) => {
      prediction.push({ intentId: intentId, confidence: confidence });
    });
    return prediction;
  }

  predict(input: Tensor): number {
    const probabilities = (this._model.predict(
      input,
    ) as Tensor).arraySync() as number[][];
    const intentId = probabilities[0].indexOf(Math.max(...probabilities[0]));
    return intentId;
  }

  evaluate(X: InputSet, y: OutputSet): number {
    const prediction = (this._model.predict(
      X,
    ) as Tensor).arraySync() as number[][];

    const yPred: number[] = prediction.map((confidences) =>
      confidences.indexOf(Math.max(...confidences)),
    );

    const yTrue = y.arraySync() as number[];

    const accuracy = accuracyScore(yTrue, yPred);
    return accuracy;
  }

  async saveModel(modelDir: string) {
    await this._model.save(`file://${modelDir}`);
  }
}
