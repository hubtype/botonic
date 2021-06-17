import { Tokenizer } from '../../types'

export class TokenizerIt implements Tokenizer {
  readonly locale = 'it'
  private tokenizer = new (require('@nlpjs/lang-it/src/tokenizer-it'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
