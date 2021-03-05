import * as TreebankWordTokenizer from 'natural/lib/natural/tokenizers/treebank_word_tokenizer'

import { Tokenizer } from '../../types'

export default class TokenizerEs implements Tokenizer {
  readonly locale = 'es'
  private tokenizer = new TreebankWordTokenizer()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
