import { shuffle } from './util/object-tools';
import { Preprocessor } from './preprocessor';
import { ModelManager } from './model-manager';
import { IntentsProcessor } from './intents-processor';
import { DataReader } from './data-reader';
import { mkdir, writeFileSync } from 'fs';
import {
  Normalizer,
  Stemmer,
  Tokenizer,
  DecodedPrediction,
  Language,
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
import { readJSON } from './util/file-system';
import { tensor } from '@tensorflow/tfjs-node';
import { join } from 'path';
import { MODELS_DIR, MODEL_DATA_FILENAME, NLU_DIR } from './constants';

export class BotonicNLU {
  private _preprocessor: Preprocessor;
  private _modelManager: ModelManager;
  private _intentsProcessor: IntentsProcessor;
  private _dataReader: DataReader;

  private _data: DataSet;
  private _trainSet: DataSet;
  private _testSet: DataSet;

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

  loadModelData(modelDataPath: string) {
    const info = readJSON(modelDataPath);
    this._preprocessor.language = info.language;
    this._preprocessor.maxSeqLen = info.maxSeqLen;
    this._preprocessor.vocabulary = info.vocabulary;
    this._intentsProcessor.loadEncoderDecoder(info.intents);
  }

  async loadModel(modelPath: string) {
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
        return {
          intent: this._intentsProcessor.decode(intentConfidence.intentId),
          confidence: intentConfidence.confidence,
        };
      },
    );
    return decodedPrediction;
  }

  // TO DO: What to do if the path is not a csv.
  loadData(path: string, language: Language, maxSeqLen: number) {
    this._data = this._dataReader.readData(path);
    this._preprocessor.language = language;
    this._preprocessor.maxSeqLen = maxSeqLen;
  }

  splitData(testPercentage: number = 0.25) {
    if (testPercentage > 1 || testPercentage < 0) {
      throw new RangeError(
        'testPercentage should be a number between 0 and 1.',
      );
    }

    const dataSize = this._data.length;
    const testSize = Math.round(dataSize * testPercentage);

    this._data = shuffle(this._data);

    this._testSet = this._data.slice(0, testSize);
    this._trainSet = this._data.slice(testSize, dataSize);

    this._preprocessor.generateVocabulary(this._trainSet);
    this._intentsProcessor.generateEncoderDecoder(this._trainSet);
  }

  async createModel(
    learningRate: number,
    wordEmbeddingsType: WordEmbeddingType = '10k-fasttext',
    wordEmbeddingsDimension: WordEmbeddingDimension = 300,
    trainableEmbeddings: boolean = true,
  ) {
    const wordEmbeddingsConfig: WordEmbeddingsConfig = {
      type: wordEmbeddingsType,
      dimension: wordEmbeddingsDimension,
      language: this._preprocessor.language,
      vocabulary: this._preprocessor.vocabulary,
    };

    const parameters: ModelParameters = {
      maxSeqLen: this._preprocessor.maxSeqLen,
      learningRate: learningRate,
      intentsCount: this._intentsProcessor.intentsCount,
      trainableEmbeddings: trainableEmbeddings,
    };

    await this._modelManager.createModel(wordEmbeddingsConfig, parameters);
  }

  async train(
    epochs: number,
    batchSize: number,
    validationSplit: number = 0.1,
  ) {
    const [xTrain, yTrain] = this._splitInputOutput(this._trainSet);

    const parameters: TrainingParameters = {
      X: xTrain,
      y: yTrain,
      epochs: epochs,
      batchSize: batchSize,
      validationSplit: validationSplit,
    };

    await this._modelManager.train(parameters);
  }

  evaluate(): number {
    const [xTest, yTest] = this._splitInputOutput(this._testSet);
    const accuracy = this._modelManager.evaluate(xTest, yTest);
    return accuracy;
  }

  private _splitInputOutput(data: DataSet): [InputSet, OutputSet] {
    const x = tensor(
      data.map((sample) => this._preprocessor.preprocess(sample.feature)),
    );

    const y = tensor(
      data.map((sample) => this._intentsProcessor.encode(sample.label)),
    );
    return [x, y];
  }

  async saveModel() {
    const modelDir = join(
      process.cwd(),
      'tests',
      NLU_DIR,
      MODELS_DIR,
      this._preprocessor.language,
    );

    mkdir(modelDir, { recursive: true }, (err) => {
      if (err) throw err;
    });

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
