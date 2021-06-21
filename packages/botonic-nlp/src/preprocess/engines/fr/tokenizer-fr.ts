import { Tokenizer } from '../../types'

export class TokenizerFr implements Tokenizer {
  readonly locale = 'fr'
  private tokenizer = new (require('@nlpjs/lang-fr/src/tokenizer-fr'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
