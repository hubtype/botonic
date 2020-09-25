// import { data, LayersModel, Sequential, train } from '@tensorflow/tfjs';
import { csvParse } from 'd3';
import { readFileSync } from 'fs';
import { shuffle } from './util/object-tools';
import { NewPreprocessor } from './new-preprocessor';
import { NewModelManager } from './new-model-manager';
import { Normalizer, Stemmer, Tokenizer, Prediction } from './types';
import { readJSON } from './util/file-system';

type Sample = { label: string; feature: string };
type Data = Sample[];

export class NewBotonicNLU {
  private _preprocessor: NewPreprocessor;
  private _modelManager: NewModelManager;

  private _data: Data;
  private _trainSet: Data;
  private _testSet: Data;

  constructor() {
    this._preprocessor = new NewPreprocessor();
    this._modelManager = new NewModelManager();
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
    this._modelManager.intents = info.intents;
  }

  async loadModel(modelPath: string) {
    await this._modelManager.loadModel(modelPath);
  }

  predict(sentence: string): Prediction {
    const input = this._preprocessor.preprocess(sentence);
    const prediction = this._modelManager.predict(input);
    return prediction;
  }

  // loadModel(modelPath: string) {}

  // TO DO: Create the vocabulary
  loadData(path: string) {
    const extension = path.split('.').pop();
    if (extension == 'csv') {
      this._readCSV(path);
    } else {
    }
    // this._preprocessor.createVocabulary(this._data);
  }

  private _readCSV(path: string): void {
    const text = readFileSync(path, 'utf-8');
    const info = csvParse(text);
    this._data = info.map((sample) => {
      return { label: sample.label, feature: sample.feature };
    });
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
  }
}
