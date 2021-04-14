import { Tokenizer } from '../types'

export class TokenizerEn implements Tokenizer {
  readonly locale = 'en'
  private tokenizer = new (require('@nlpjs/lang-en-min/src/tokenizer-en'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
