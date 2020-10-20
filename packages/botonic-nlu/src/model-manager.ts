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
  ModelTemplates,
} from './types';
import { accuracyScore } from 'machinelearn/metrics';

export class ModelManager {
  protected constructor(readonly model: Sequential | LayersModel) {}

  static fromModel(model: Sequential | LayersModel): ModelManager {
    return new ModelManager(model);
  }

  static async fromModelPath(path: string): Promise<ModelManager> {
    const model = await loadLayersModel(`file://${path}`);
    return new ModelManager(model);
  }

  static async fromModelTemplate(
    template: ModelTemplates,
    wordEmbeddingsConfig: WordEmbeddingsConfig,
    parameters: ModelParameters,
  ): Promise<ModelManager> {
    const wordEmbeddingsManager = await WordEmbeddingsManager.withConfig(
      wordEmbeddingsConfig,
    );
    const wordEmbeddingsMatrix = wordEmbeddingsManager.matrix;

    switch (template) {
      case ModelTemplates.SIMPLE_NN:
      default:
        return new ModelManager(
          new SimpleNN(parameters, wordEmbeddingsMatrix).model,
        );
    }
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
