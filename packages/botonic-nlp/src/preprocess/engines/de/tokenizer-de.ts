import { Tokenizer } from '../../types'

export class TokenizerDe implements Tokenizer {
  readonly locale = 'de'
  private tokenizer = new (require('@nlpjs/lang-de/src/tokenizer-de'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
