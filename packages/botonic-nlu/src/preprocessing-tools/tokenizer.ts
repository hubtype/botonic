import { TreebankWordTokenizer } from 'natural';
import { Tokenizer } from '../types';

export class DefaultTokenizer {
  private _tokenizer: Tokenizer;
  constructor() {
    this._tokenizer = new TreebankWordTokenizer();
  }
  tokenize(sentence: string): string[] {
    return this._tokenizer.tokenize(sentence);
  }
}
