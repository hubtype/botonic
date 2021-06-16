import { Stemmer } from '../../types'

export class StemmerFr implements Stemmer {
  readonly locale = 'fr'
  private stemmer = new (require('@nlpjs/lang-fr/src/stemmer-fr'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
