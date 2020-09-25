import {
  Sample,
  TokenizerLike,
  Word2Index,
  Index2Word,
  WordCount,
} from './types';

import { Tensor1D, tensor1d, Tensor, stack } from '@tensorflow/tfjs-node';

const UNKNOWN_TOKEN = '<UNK>';
export class PreProcessing {
  private _samples: Sample[] = [];
  private _tokenizer: TokenizerLike;
  vocabularyLength = 1;
  private _word2Index: Word2Index;
  index2Word: Index2Word;
  private _wordCount: WordCount = {};
  maxSentenceLength = 0;
  private _sequences: number[][];

  constructor(samples: Sample[], tokenizer: TokenizerLike) {
    this._samples = samples;
    this._tokenizer = tokenizer;
    this._word2Index = { [UNKNOWN_TOKEN]: 0 };
    this.index2Word = { 0: `${UNKNOWN_TOKEN}` };
  }

  get samples(): Sample[] {
    return this._samples;
  }
  get sequences(): number[][] {
    return this._sequences;
  }

  get vocabulary(): Word2Index {
    return this._word2Index;
  }

  get tokenizer(): TokenizerLike {
    return this._tokenizer;
  }

  preprocess(): { sequences: number[][]; maxSentenceLength: number } {
    const tokenizedSamples = this._tokenizeSamples();
    this._generateVocabulary(tokenizedSamples);
    this._sequences = this.samplesToSequences(tokenizedSamples);
    return {
      sequences: this._sequences,
      maxSentenceLength: this.maxSentenceLength,
    };
  }

  padSequences(sequences: number[][], toPadLength: number): Tensor {
    const paddedSequences: Tensor1D[] = [];
    sequences.forEach((sequence) => {
      const tensor: Tensor1D = tensor1d(sequence).pad([
        [toPadLength - sequence.length, 0],
      ]);
      // tensor.print();
      paddedSequences.push(tensor);
    });
    return stack(paddedSequences);
  }

  normalize(value: string): string {
    return value.toLowerCase();
  }

  tokenize(value: string): string[] {
    return this._tokenizer.tokenize(value);
  }

  private _tokenizeSamples(): string[][] {
    return this.samples.map((sample) => {
      const tokenizedSample = this.tokenize(this.normalize(sample.value));
      if (tokenizedSample.length > this.maxSentenceLength)
        this.maxSentenceLength = tokenizedSample.length;
      return tokenizedSample;
    });
  }

  private _addWord(word: string): void {
    if (!(word in this._word2Index)) {
      this._word2Index[word] = this.vocabularyLength;
      this._wordCount[word] = 1;
      this.index2Word[this.vocabularyLength] = word;
      this.vocabularyLength++;
    } else {
      this._wordCount[word] += 1;
    }
  }
  private _generateVocabulary(tokenizedSamples: string[][]): void {
    tokenizedSamples.forEach((tokenizedSample) => {
      tokenizedSample.forEach((word) => {
        this._addWord(word);
      });
    });
  }

  samplesToSequences(tokenizedSamples: string[][]): number[][] {
    const sequences: number[][] = [];
    tokenizedSamples.forEach((tokenizedSample) => {
      const sequence: number[] = [];
      tokenizedSample.forEach((word) => {
        if (!(word in this._word2Index))
          sequence.push(this.toIndex(UNKNOWN_TOKEN));
        else sequence.push(this.toIndex(word));
      });
      sequences.push(sequence);
    });
    return sequences;
  }

  toWord(index: number): string {
    return this.index2Word[index];
  }

  toIndex(word: string): number {
    return this._word2Index[word];
  }
}
