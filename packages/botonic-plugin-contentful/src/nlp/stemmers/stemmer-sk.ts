import { Stemmer } from '@nlpjs/core/src'

export class StemmerSk implements Stemmer {
  stem(tokens: string[]): string[] {
    return tokens
  }
}
