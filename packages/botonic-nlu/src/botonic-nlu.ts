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
  private _preprocessor: Preprocessor;
  private _modelManager: ModelManager;
  private _intentsProcessor: IntentsProcessor;
  private _dataReader: DataReader;

  constructor() {
    this._preprocessor = new Preprocessor();
    this._modelManager = new ModelManager();
    this._intentsProcessor = new IntentsProcessor();
    this._dataReader = new DataReader();
  }

  set normalizer(value: Normalizer) {
    this._preprocessor.normalizer = value;
  }

  set stemmer(value: Stemmer) {
    this._preprocessor.stemmer = value;
  }

  set tokenizer(value: Tokenizer) {
    this._preprocessor.tokenizer = value;
  }

  set model(model: Sequential | LayersModel) {
    this._modelManager.model = model;
  }

  loadModelData(modelDataPath: string): void {
    const info = readJSON(modelDataPath);
    this._preprocessor.language = info.language;
    this._preprocessor.maxSeqLen = info.maxSeqLen;
    this._preprocessor.vocabulary = info.vocabulary;
    this._intentsProcessor.loadEncoderDecoder(info.intents);
  }

  async loadModel(modelPath: string): Promise<void> {
    await this._modelManager.loadModel(modelPath);
  }

  predict(sentence: string): string {
    const input = tensor([this._preprocessor.preprocess(sentence)]);
    const intentId = this._modelManager.predict(input);
    const intent = this._intentsProcessor.decode(intentId);
    return intent;
  }

  predictProbabilities(sentence: string): DecodedPrediction {
    const input = tensor([this._preprocessor.preprocess(sentence)]);
    const encodedPrediction = this._modelManager.predictProbabilities(input);
    const decodedPrediction: DecodedPrediction = encodedPrediction.map(
      (intentConfidence) => {
        const intent = this._intentsProcessor.decode(intentConfidence.intentId);
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
    this._preprocessor.language = options.language;
    this._preprocessor.maxSeqLen = options.maxSeqLen;
    return this._dataReader.readData(options.path);
  }

  trainTestSplit(options: {
    data: DataSet;
    testPercentage: number;
  }): [InputSet, InputSet, OutputSet, OutputSet] {
    if (options.testPercentage > 1 || options.testPercentage < 0) {
      throw new RangeError(
        'testPercentage should be a number between 0 and 1.',
      );
    }

    const data = shuffle(options.data);

    const dataSize = options.data.length;
    const testSize = Math.round(dataSize * options.testPercentage);

    const testSet = data.slice(0, testSize);
    const trainSet = data.slice(testSize, dataSize);

    this._preprocessor.generateVocabulary(trainSet);
    this._intentsProcessor.generateEncoderDecoder(trainSet);

    const [xTrain, yTrain] = this._inputOutputSplit(trainSet);
    const [xTest, yTest] = this._inputOutputSplit(testSet);

    return [xTrain, xTest, yTrain, yTest];
  }

  private _inputOutputSplit(data: DataSet): [InputSet, OutputSet] {
    const x = tensor(
      data.map((sample) => this._preprocessor.preprocess(sample.feature)),
    );

    const y = tensor(
      data.map((sample) => this._intentsProcessor.encode(sample.label)),
    );
    return [x, y];
  }

  async createModel(options: {
    learningRate: number;
    wordEmbeddingsType?: WordEmbeddingType;
    wordEmbeddingsDimension?: WordEmbeddingDimension;
    trainableEmbeddings?: boolean;
  }): Promise<void> {
    const wordEmbeddingsConfig: WordEmbeddingsConfig = {
      type: options.wordEmbeddingsType || '10k-fasttext',
      dimension: options.wordEmbeddingsDimension || 300,
      language: this._preprocessor.language,
      vocabulary: this._preprocessor.vocabulary,
    };

    const parameters: ModelParameters = {
      maxSeqLen: this._preprocessor.maxSeqLen,
      learningRate: options.learningRate,
      intentsCount: this._intentsProcessor.intentsCount,
      trainableEmbeddings: options.trainableEmbeddings || false,
    };

    await this._modelManager.createModel(wordEmbeddingsConfig, parameters);
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
    const parameters: TrainingParameters = {
      X: x,
      y: y,
      epochs: options?.epochs || 10,
      batchSize: options?.batchSize || 8,
      validationSplit: options?.validationSplit || 0.2,
    };

    await this._modelManager.train(parameters);
  }

  evaluate(x: InputSet, y: OutputSet): number {
    const accuracy = this._modelManager.evaluate(x, y);
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
        this._preprocessor.language,
      );
    mkdirSync(modelDir, { recursive: true });

    const modelDataPath = join(modelDir, MODEL_DATA_FILENAME);

    const modelData: ModelData = {
      language: this._preprocessor.language,
      intents: this._intentsProcessor.decoder,
      maxSeqLen: this._preprocessor.maxSeqLen,
      vocabulary: this._preprocessor.vocabulary,
    };
    writeFileSync(modelDataPath, JSON.stringify(modelData));

    await this._modelManager.saveModel(modelDir);
  }
}
