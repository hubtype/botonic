import { Tokenizer } from '../../types'

export class TokenizerEs implements Tokenizer {
  readonly locale = 'en'
  private tokenizer = new (require('@nlpjs/lang-es/src/tokenizer-es'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
