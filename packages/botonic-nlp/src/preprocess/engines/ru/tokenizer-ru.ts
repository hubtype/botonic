import { Tokenizer } from '../../types'

export class TokenizerRu implements Tokenizer {
  readonly locale = 'ru'
  private tokenizer = new (require('@nlpjs/lang-ru/src/tokenizer-ru'))()

  tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text)
  }
}
