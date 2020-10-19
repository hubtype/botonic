/* eslint-disable @typescript-eslint/unbound-method */
import { shuffle } from './util/object-tools';
import { Preprocessor } from './preprocessor';
import { ModelManager } from './model-manager';
import { IntentsProcessor } from './intents-processor';
import { DataReader } from './data-reader';
import {
  Normalizer,
  Stemmer,
  Tokenizer,
  DecodedPrediction,
  WordEmbeddingType,
  WordEmbeddingDimension,
  WordEmbeddingsConfig,
  DataSet,
  InputSet,
  OutputSet,
  ModelParameters,
  TrainingParameters,
  ModelData,
} from './types';
import { Language } from './language';
import { readJSON } from './util/file-system';
import { LayersModel, Sequential, tensor } from '@tensorflow/tfjs-node';
import { join } from 'path';
import { MODELS_DIR, MODEL_DATA_FILENAME, NLU_DIR } from './constants';
import { mkdirSync, writeFileSync } from 'fs';

export class BotonicNLU {
  private dataReader = new DataReader();
  private preprocessor = new Preprocessor();
  private modelManager = new ModelManager();
  private intentsProcessor: IntentsProcessor;

  set normalizer(value: Normalizer) {
    this.preprocessor.normalizer = value;
  }

  set stemmer(value: Stemmer) {
    this.preprocessor.stemmer = value;
  }

  set tokenizer(value: Tokenizer) {
    this.preprocessor.tokenizer = value;
  }

  set model(model: Sequential | LayersModel) {
    this.modelManager.model = model;
  }

  loadModelData(modelDataPath: string): void {
    const info = readJSON(modelDataPath);
    this.preprocessor.language = info.language;
    this.preprocessor.maxSeqLen = info.maxSeqLen;
    this.preprocessor.vocabulary = info.vocabulary;
    this.intentsProcessor = IntentsProcessor.fromDecoder(info.intents);
  }

  async loadModel(modelPath: string): Promise<void> {
    await this.modelManager.loadModel(modelPath);
  }

  predict(sentence: string): string {
    const input = tensor([this.preprocessor.preprocess(sentence)]);
    const intentId = this.modelManager.predict(input);
    const intent = this.intentsProcessor.decode(intentId);
    return intent;
  }

  predictProbabilities(sentence: string): DecodedPrediction {
    const input = tensor([this.preprocessor.preprocess(sentence)]);
    const encodedPrediction = this.modelManager.predictProbabilities(input);
    const decodedPrediction: DecodedPrediction = encodedPrediction.map(
      (intentConfidence) => {
        const intent = this.intentsProcessor.decode(intentConfidence.intentId);
        return {
          intent: intent,
          confidence: intentConfidence.confidence,
        };
      },
    );
    return decodedPrediction;
  }

  loadData(options: {
    path: string;
    language: Language;
    maxSeqLen: number;
  }): DataSet {
    this.preprocessor.language = options.language;
    this.preprocessor.maxSeqLen = options.maxSeqLen;
    return this.dataReader.readData(options.path);
  }

  trainTestSplit(options: {
    data: DataSet;
    testPercentage: number;
    stratify: boolean;
  }): [InputSet, InputSet, OutputSet, OutputSet] {
    if (options.testPercentage > 1 || options.testPercentage < 0) {
      throw new RangeError(
        'testPercentage should be a number between 0 and 1.',
      );
    }

    const stratify = options.stratify !== undefined ? options.stratify : true;
    const data = shuffle(options.data);

    let trainSet = [];
    let testSet = [];

    if (stratify) {
      const intents = Array.from(new Set(data.map((sample) => sample.label)));

      for (const intent of intents) {
        const intentData = data.filter((sample) => sample.label == intent);
        const intentSize = intentData.length;
        const testSize = Math.round(intentSize * options.testPercentage);
        testSet = testSet.concat(intentData.slice(0, testSize));
        trainSet = trainSet.concat(intentData.slice(testSize, intentSize));
      }
    } else {
      const dataSize = data.length;
      const testSize = Math.round(dataSize * options.testPercentage);
      testSet = testSet.concat(data.slice(0, testSize));
      trainSet = trainSet.concat(data.slice(testSize, dataSize));
    }

    this.preprocessor.generateVocabulary(trainSet);
    this.intentsProcessor = IntentsProcessor.fromData(trainSet);

    const [xTrain, yTrain] = this.inputOutputSplit(trainSet);
    const [xTest, yTest] = this.inputOutputSplit(testSet);

    return [xTrain, xTest, yTrain, yTest];
  }

  private inputOutputSplit(data: DataSet): [InputSet, OutputSet] {
    const x = tensor(
      data.map((sample) => this.preprocessor.preprocess(sample.feature)),
    );

    const y = tensor(
      data.map((sample) => this.intentsProcessor.encode(sample.label)),
    );
    return [x, y];
  }

  async createModel(options: {
    learningRate: number;
    wordEmbeddingsType?: WordEmbeddingType;
    wordEmbeddingsDimension?: WordEmbeddingDimension;
    trainableEmbeddings?: boolean;
  }): Promise<void> {
    const wordEmbeddingsConfig = {
      type: options.wordEmbeddingsType || '10k-fasttext',
      dimension: options.wordEmbeddingsDimension || 300,
      language: this.preprocessor.language,
      vocabulary: this.preprocessor.vocabulary,
    };

    const parameters = {
      maxSeqLen: this.preprocessor.maxSeqLen,
      learningRate: options.learningRate,
      intentsCount: this.intentsProcessor.intentsCount,
      trainableEmbeddings: options.trainableEmbeddings || false,
    };

    await this.modelManager.createModel(wordEmbeddingsConfig, parameters);
  }

  async train(
    x: InputSet,
    y: OutputSet,
    options?: {
      epochs: number;
      batchSize?: number;
      validationSplit?: number;
    },
  ): Promise<void> {
    const parameters = {
      X: x,
      y: y,
      epochs: options?.epochs || 10,
      batchSize: options?.batchSize || 8,
      validationSplit: options?.validationSplit || 0.2,
    };

    await this.modelManager.train(parameters);
  }

  evaluate(x: InputSet, y: OutputSet): number {
    const accuracy = this.modelManager.evaluate(x, y);
    return accuracy;
  }

  async saveModel(path?: string): Promise<void> {
    const modelDir =
      path ||
      join(
        process.cwd(),
        'src',
        NLU_DIR,
        MODELS_DIR,
        this.preprocessor.language,
      );
    mkdirSync(modelDir, { recursive: true });

    const modelDataPath = join(modelDir, MODEL_DATA_FILENAME);

    const modelData = {
      language: this.preprocessor.language,
      intents: this.intentsProcessor.decoder,
      maxSeqLen: this.preprocessor.maxSeqLen,
      vocabulary: this.preprocessor.vocabulary,
    };
    writeFileSync(modelDataPath, JSON.stringify(modelData));

    await this.modelManager.saveModel(modelDir);
  }
}
