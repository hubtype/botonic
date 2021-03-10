// eslint-disable-next-line import/no-unresolved
import { TokenizerEs as TreebankWordTokenizer } from '@nlpjs/lang-es/src/tokenizer-es'

import { Tokenizer } from '../../types'

export default class TokenizerEs implements Tokenizer {
  readonly locale = 'es'
  private tokenizer = new TreebankWordTokenizer()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
