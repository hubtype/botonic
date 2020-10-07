import { UNKNOWN_TOKEN } from './constants';
import {
  DataSet,
  Language,
  Vocabulary,
  Normalizer,
  Stemmer,
  Tokenizer,
} from './types';

export class Preprocessor {
  private _normalizer: Normalizer;
  private _stemmer: Stemmer;
  private _tokenizer: Tokenizer;
  private _language: Language;
  private _maxSeqLen: number;
  private _vocabulary: Vocabulary;

  set normalizer(value: Normalizer) {
    this._normalizer = value;
  }

  set stemmer(value: Stemmer) {
    this._stemmer = value;
  }

  set tokenizer(value: Tokenizer) {
    this._tokenizer = value;
  }

  set language(value: Language) {
    this._language = value;
  }

  set maxSeqLen(value: number) {
    this._maxSeqLen = value;
  }

  set vocabulary(vocabulary: Vocabulary) {
    this._vocabulary = vocabulary;
  }

  get vocabulary(): Vocabulary {
    return this._vocabulary;
  }

  get language(): Language {
    return this._language;
  }

  get maxSeqLen(): number {
    return this._maxSeqLen;
  }

  // TO DO: Maybe vocabulary should be generated with a different data set than the train or test one.
  generateVocabulary(data: DataSet) {
    this._vocabulary = {};
    this.vocabulary[UNKNOWN_TOKEN] = 0;
    let id = 1;
    data.forEach((sample) => {
      const normalizedSentence = this._normalizer.normalize(sample.feature);
      const stemmedSentence = this._stemmer.stem(
        normalizedSentence,
        this._language,
      );
      const tokens = this._tokenizer.tokenize(stemmedSentence);
      tokens.forEach((token) => {
        if (!(token in this._vocabulary)) {
          this._vocabulary[token] = id;
          id++;
        }
      });
    });
  }

  preprocess(sentence: string) {
    const normalizedSentence = this._normalizer.normalize(sentence);
    const stemmedSentence = this._stemmer.stem(
      normalizedSentence,
      this._language,
    );
    const tokens = this._tokenizer.tokenize(stemmedSentence);
    const sequence = this._computeSequence(tokens);
    const truncatedSequence = this._truncate(sequence);
    const paddedSequence = this._paddSequence(truncatedSequence);
    return paddedSequence;
  }

  private _computeSequence(tokens: string[]): number[] {
    const sequence = tokens.map((token) =>
      token in this._vocabulary ? this._vocabulary[token] : 0,
    );
    return sequence;
  }

  private _truncate(sequence: number[]): number[] {
    return sequence.length > this._maxSeqLen
      ? sequence.slice(0, this._maxSeqLen)
      : sequence;
  }

  // TO DO: check differences between pre and post padding.
  private _paddSequence(truncatedSequence: number[]): number[] {
    const padd = Array(this._maxSeqLen - truncatedSequence.length).fill(0);
    const paddedSequence = padd.concat(truncatedSequence);
    return paddedSequence;
  }
}
