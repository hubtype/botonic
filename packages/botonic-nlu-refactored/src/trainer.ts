import {
  Locale,
  IntentData,
  Intent,
  Labels,
  Sample,
  ReversedLabels,
  HyperParameters,
  WordEmbeddingsConfig,
  TokenizerLike,
  WordEmbeddingsCompleteConfig,
  TrainingInfo,
} from './types';
import { flipObject, shuffle } from './util/object-tools';
import * as tf from '@tensorflow/tfjs-node';

import { PreProcessing } from './preprocessing';
import { WordEmbeddingsMatrix } from './embeddings/word-embeddings-matrix';
import { Tensor } from '@tensorflow/tfjs-node';
import { TreebankWordTokenizer } from 'natural';
import { NNModel } from './nn-model';
import { writeJSON, createDirIfNotExists } from './util/file-system';
import { join } from 'path';
import {
  MODELS_DIR,
  NLU_DIR,
  TRAINING_INFO_FILENAME,
  EXTENSIONS,
} from './constants';

const DEFAULT_PARAMS: HyperParameters = {
  learningRate: 0.01,
  epochs: 10,
  units: 5,
  validationSplit: 0.2,
  dropoutRegularization: 0.2,
};

export class Trainer {
  private _locale: Locale;
  private _wordEmbeddingsConfig: WordEmbeddingsCompleteConfig | undefined;
  private _index2Intent: Labels = {};
  private _intent2Index: ReversedLabels = {};
  private _samples: Sample[] = [];
  private _paddingSequenceLength: number;
  preprocessing: PreProcessing = undefined;
  private _params: HyperParameters = undefined;
  private _model: tf.Sequential | tf.LayersModel = undefined;
  private _wordEmbeddingsMatrix: tf.Tensor<tf.Rank> = undefined;

  constructor(locale: Locale, intentsData: IntentData) {
    this._locale = locale;
    this._prepareDataSamples(intentsData);
    shuffle(this._samples); // https://github.com/keras-team/keras/issues/4298#issuecomment-545554789
  }

  get labels(): Labels {
    return this._index2Intent;
  }

  private get _reversedLabels(): ReversedLabels {
    return this._intent2Index;
  }

  get reversedLabels(): ReversedLabels {
    return this._intent2Index;
  }

  get samples(): Sample[] {
    return this._samples;
  }

  get params(): HyperParameters {
    return this._params;
  }

  get sequenceLength(): number {
    return this._paddingSequenceLength;
  }

  get embeddings(): WordEmbeddingsCompleteConfig {
    return this._wordEmbeddingsConfig;
  }

  private _prepareDataSamples(intentsData: IntentData): void {
    const intents = Object.keys(intentsData) as Intent[];
    intents.forEach((intent: Intent, index: number) => {
      this._index2Intent[index] = intent;
    });
    this._intent2Index = flipObject(this._index2Intent);
    intents.forEach((intent: Intent) => {
      intentsData[intent].forEach((utterance) => {
        this._samples.push({
          value: utterance,
          label: this._reversedLabels[intent],
          locale: this._locale,
        });
      });
    });
  }

  withTokenizer(tokenizer: TokenizerLike): this {
    this.preprocessing = new PreProcessing(this.samples, tokenizer);
    this.preprocessing.preprocess();
    this._updatePaddingSequenceLength();
    return this;
  }

  withWordEmbeddings(config: WordEmbeddingsConfig): this {
    this._wordEmbeddingsConfig = { ...{ locale: this._locale }, ...config };
    return this;
  }

  withParams(params?: HyperParameters): this {
    // if (!this.preprocessing) this.withTokenizer(new TreebankWordTokenizer());
    this._params = Object.assign(DEFAULT_PARAMS, params);
    if (params?.maxSequenceLength >= this.preprocessing?.maxSentenceLength) {
      this.withTokenizer(this.preprocessing.tokenizer);
    } else {
      console.debug(
        `TAKING MAX LENGTH OF SENTENCE TO PAD: ${this.preprocessing.maxSentenceLength}`,
      );
    }
    return this;
  }

  private _updatePaddingSequenceLength(): void {
    this._paddingSequenceLength = this.preprocessing.maxSentenceLength;
    if (this.params?.maxSequenceLength)
      this._paddingSequenceLength = this.params.maxSequenceLength;
  }

  async getEmbeddingMatrix(): Promise<tf.Tensor> {
    const wordEmbeddings = new WordEmbeddingsMatrix(
      this._wordEmbeddingsConfig,
      this.preprocessing.vocabulary,
    );
    try {
      await wordEmbeddings.load();
    } catch (e) {
      console.error(e);
    }
    await wordEmbeddings.generate();
    this._wordEmbeddingsMatrix = wordEmbeddings.tensorMatrix;
    return wordEmbeddings.tensorMatrix;
  }

  private _withModel(
    model: tf.Sequential | tf.LayersModel,
    embeddingsMatrix?: tf.Tensor,
  ): tf.Sequential | tf.LayersModel {
    return (
      model ??
      new NNModel(
        this.sequenceLength,
        this.preprocessing.vocabulary,
        this.reversedLabels,
        this.params,
        this._wordEmbeddingsConfig.trainable,
        embeddingsMatrix,
      ).model
    );
  }

  private get _X(): Tensor {
    const X = this.preprocessing.padSequences(
      this.preprocessing.sequences,
      this._paddingSequenceLength,
    );
    console.debug(`Shape of X: [${X.shape}]`);
    return X;
  }
  private get _Y(): Tensor {
    const labels = this.samples.map((sample) => sample.label);
    const Y = tf.oneHot(
      tf.tensor1d(labels, 'int32'),
      Object.keys(this.labels).length,
    );
    console.debug(`Shape of Y: [${Y.shape}]`);
    return Y;
  }

  async run(model?: any): Promise<void> {
    if (Object.keys(this.labels).length < 2) {
      throw Error('You need at least two intents to train');
    }
    if (!this.preprocessing) this.withTokenizer(new TreebankWordTokenizer());
    if (!this.params) this.withParams();
    if (!this._wordEmbeddingsConfig) {
      this.withWordEmbeddings({
        kind: '10k-fasttext',
        dimension: 300,
        trainable: false,
      });
    }
    const wordEmbeddingsMatrix =
      this._wordEmbeddingsMatrix || (await this.getEmbeddingMatrix());
    this._model = this._withModel(model, wordEmbeddingsMatrix);
    console.debug('TRAINING...');
    const history = await this._model.fit(this._X, this._Y, {
      epochs: this._params.epochs,
      validationSplit: this._params.validationSplit,
    });
  }

  private _inputToSequence(input: string): Tensor {
    const tokenizedSample = this.preprocessing.tokenize(
      this.preprocessing.normalize(input),
    );
    const sequences = this.preprocessing.samplesToSequences([tokenizedSample]);
    const paddedSequences = this.preprocessing
      .padSequences(sequences, this._paddingSequenceLength)
      .dataSync();
    return tf.tensor([paddedSequences]);
  }

  predict(input: string): void {
    const paddedTensor = this._inputToSequence(input);
    const prediction = this._model.predict(paddedTensor) as tf.Tensor;
    const intent: any = {};
    const intents = Array.from(prediction.dataSync())
      .map((confidence, i) => {
        return {
          intent: this._index2Intent[i],
          confidence: confidence,
        };
      })
      .sort((a: any, b: any) => b.confidence - a.confidence);
    intent.locale = this._locale;
    intent.intent = intents[0].intent;
    intent.confidence = intents[0].confidence;
    console.debug('\n');
    console.debug('INPUT  : ', input);
    console.debug('RESULT : ', `${intent.intent} <> ${intent.confidence}`);
    console.debug(
      'TOP SCORES  : ',
      `1.${intents[0].intent}, 2. ${intents[1].intent}, 3.${intents[2].intent}\n`,
    );
  }

  async save(): Promise<void> {
    const modelsPath = join(process.cwd(), 'tests', NLU_DIR, MODELS_DIR);
    createDirIfNotExists(modelsPath);
    const trainingInfo: TrainingInfo = {
      language: this._locale,
      intentsDict: this.labels,
      maxSeqLength: this.sequenceLength,
      vocabulary: this.preprocessing.vocabulary,
    };
    const trainingInfoPath = join(modelsPath, this._locale);
    createDirIfNotExists(trainingInfoPath);
    writeJSON(
      join(trainingInfoPath, TRAINING_INFO_FILENAME, EXTENSIONS.JSON),
      trainingInfo,
    );
    console.debug('Saving model...');
    await this._model.save(`file://${trainingInfoPath}`);
  }
}
