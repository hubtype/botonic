import { Stemmer } from '../types'

export class StemmerEs implements Stemmer {
  readonly locale = 'es'
  private stemmer = new (require('@nlpjs/lang-es/src/stemmer-es'))()

  stem(tokens: string[]): string[] {
    return this.stemmer.stem(tokens)
  }
}
