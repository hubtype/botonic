import {
  Sequential,
  LayersModel,
  loadLayersModel,
  Tensor,
} from '@tensorflow/tfjs-node';
import { SimpleNN } from './simple-nn';
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
  model: Sequential | LayersModel;
  private _wordEmbeddingsManager: WordEmbeddingsManager;

  constructor() {
    this._wordEmbeddingsManager = new WordEmbeddingsManager();
  }

  async loadModel(modelPath: string): Promise<void> {
    this.model = await loadLayersModel(`file://${modelPath}`);
  }

  async createModel(
    wordEmbeddingsConfig: WordEmbeddingsConfig,
    parameters: ModelParameters,
  ): Promise<void> {
    await this._wordEmbeddingsManager.generateWordEmbeddingsMatrix(
      wordEmbeddingsConfig,
    );
    const wordEmbeddingsMatrix: Tensor = this._wordEmbeddingsManager
      .wordEmbeddingsMatrix;

    this.model = new SimpleNN(parameters, wordEmbeddingsMatrix).model;
  }

  async train(parameters: TrainingParameters): Promise<void> {
    const { X, y, batchSize, epochs, validationSplit } = parameters;
    await this.model.fit(X, y, {
      epochs: epochs,
      batchSize: batchSize,
      validationSplit: validationSplit,
    });
  }

  predictProbabilities(input: Tensor): EncodedPrediction {
    const prediction: EncodedPrediction = [];
    const confidences = (this.model.predict(input) as Tensor).dataSync();
    confidences.forEach((confidence: number, intentId: number) => {
      prediction.push({ intentId: intentId, confidence: confidence });
    });
    return prediction;
  }

  predict(input: Tensor): number {
    const probabilities = (this.model.predict(
      input,
    ) as Tensor).arraySync() as number[][];
    const intentId = probabilities[0].indexOf(Math.max(...probabilities[0]));
    return intentId;
  }

  evaluate(X: InputSet, y: OutputSet): number {
    const prediction = (this.model.predict(
      X,
    ) as Tensor).arraySync() as number[][];

    const yPred: number[] = prediction.map((confidences) =>
      confidences.indexOf(Math.max(...confidences)),
    );

    const yTrue = y.arraySync() as number[];

    const accuracy = accuracyScore(yTrue, yPred);
    return accuracy;
  }

  async saveModel(modelDir: string): Promise<void> {
    await this.model.save(`file://${modelDir}`);
  }
}
