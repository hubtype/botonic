// eslint-disable-next-line import/no-unresolved
import { TokenizerEn as TreebankWordTokenizer } from '@nlpjs/lang-en-min/src/tokenizer-en'

import { Tokenizer } from '../../types'

export default class TokenizerEn implements Tokenizer {
  readonly locale = 'en'
  private tokenizer = new TreebankWordTokenizer()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
