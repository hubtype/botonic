import { Stemmer } from '../../types'

export class StemmerRu implements Stemmer {
  readonly locale = 'ru'
  private stemmer = new (require('@nlpjs/lang-ru/src/stemmer-ru'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
