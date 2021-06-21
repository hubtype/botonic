import { Stemmer } from '../../types'

export class StemmerIt implements Stemmer {
  readonly locale = 'it'
  private stemmer = new (require('@nlpjs/lang-it/src/stemmer-it'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
