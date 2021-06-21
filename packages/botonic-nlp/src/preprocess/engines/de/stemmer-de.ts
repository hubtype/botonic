import { Stemmer } from '../../types'

export class StemmerDe implements Stemmer {
  readonly locale = 'de'
  private stemmer = new (require('@nlpjs/lang-de/src/stemmer-de'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
