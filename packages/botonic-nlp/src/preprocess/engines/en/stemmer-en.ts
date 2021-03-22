import { Stemmer } from '../../types'

export class StemmerEn implements Stemmer {
  readonly locale = 'en'
  private stemmer = new (require('@nlpjs/lang-en-min/src/stemmer-en'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
