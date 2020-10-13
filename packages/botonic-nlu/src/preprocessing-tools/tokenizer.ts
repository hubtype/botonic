// eslint-disable-next-line
import * as TreebankWordTokenizer from 'natural/lib/natural/tokenizers/treebank_word_tokenizer';
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
