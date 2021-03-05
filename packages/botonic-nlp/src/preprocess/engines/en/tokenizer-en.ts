import * as TreebankWordTokenizer from 'natural/lib/natural/tokenizers/treebank_word_tokenizer'

import { Tokenizer } from '../../types'

export default class TokenizerEn implements Tokenizer {
  readonly locale = 'en'
  private tokenizer = new TreebankWordTokenizer()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
