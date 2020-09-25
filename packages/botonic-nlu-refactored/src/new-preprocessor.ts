import { Tensor, tensor } from '@tensorflow/tfjs-node';
import { Language, Vocabulary, Normalizer, Stemmer, Tokenizer } from './types';

type Sample = { label: string; feature: string };
type Data = Sample[];

export class NewPreprocessor {
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
    const tensor = this._computeTensor(paddedSequence);
    return tensor;
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

  private _computeTensor(paddedSequence: number[]): Tensor {
    return tensor([paddedSequence]);
  }
}
