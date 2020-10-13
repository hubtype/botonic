/* eslint-disable @typescript-eslint/unbound-method */
import { DefaultTokenizer } from './preprocessing-tools/tokenizer';
import { DefaultStemmer } from './preprocessing-tools/stemmer';
import { DefaultNormalizer } from './preprocessing-tools/normalizer';
import { UNKNOWN_TOKEN } from './constants';
import { DataSet, Vocabulary, Normalizer, Stemmer, Tokenizer } from './types';
import { Language } from './language';

export class Preprocessor {
  private _normalizer: Normalizer;
  private _stemmer: Stemmer;
  private _tokenizer: Tokenizer;
  private _language: Language;
  private _maxSeqLen: number;
  private _vocabulary: Vocabulary;

  constructor() {
    this._normalizer = new DefaultNormalizer();
    this._tokenizer = new DefaultTokenizer();
    this._stemmer = new DefaultStemmer();
  }

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

  get language(): Language {
    return this._language;
  }

  set maxSeqLen(value: number) {
    this._maxSeqLen = value;
  }

  get maxSeqLen(): number {
    return this._maxSeqLen;
  }

  set vocabulary(vocabulary: Vocabulary) {
    this._vocabulary = vocabulary;
  }

  get vocabulary(): Vocabulary {
    return this._vocabulary;
  }

  // TO DO: Maybe vocabulary should be generated with a different data set than the train or test one.
  generateVocabulary(data: DataSet): Vocabulary {
    this._vocabulary = {};
    this.vocabulary[UNKNOWN_TOKEN] = 0;
    let id = 1;
    data.forEach((sample) => {
      const normalizedSentence = this._normalizer.normalize(sample.feature);
      const tokens = this._tokenizer.tokenize(normalizedSentence);
      const stemmedTokens = tokens.map((token) =>
        this._stemmer.stem(token, this._language),
      );
      stemmedTokens.forEach((token) => {
        if (!(token in this._vocabulary)) {
          this._vocabulary[token] = id;
          id++;
        }
      });
    });
    return this._vocabulary;
  }

  preprocess(sentence: string): number[] {
    const normalizedSentence = this._normalizer.normalize(sentence);
    const tokens = this._tokenizer.tokenize(normalizedSentence);
    const stemmedTokens = tokens.map((token) =>
      this._stemmer.stem(token, this._language),
    );
    const sequence = this._computeSequence(stemmedTokens);
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

  tokenize(sentence: string): string[] {
    return this._tokenizer.tokenize(sentence);
  }

  normalize(sentence: string): string {
    return this._normalizer.normalize(sentence);
  }
}
