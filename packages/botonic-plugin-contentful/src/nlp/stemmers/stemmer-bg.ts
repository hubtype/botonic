import Stemmer from '@nlpjs/core/src/stemmer'

import { bgDefaultStopWords } from '../stopwords/stopwords-bg'
import { bgTransformations } from './transformations/transformations-bg'

export class StemmerBg implements Stemmer {
  stem(tokens: string[]): string[] {
    return tokens.map(token => this.stemToken(token))
  }

  private stemToken(token: string): string {
    if (this.isStopWord(token)) {
      return token
    } else {
      return this.getRoot(token)
    }
  }

  private isStopWord(token: string): boolean {
    return bgDefaultStopWords.indexOf(token) != -1
  }

  private getRoot(token: string): string {
    const length = token.length
    if (length > 1) {
      for (let i = 0; i < length; i++) {
        const suffix = token.substring(i)
        const root = bgTransformations[suffix]
        if (root != undefined) {
          return token.substring(0, i).concat(root)
        }
      }
    }
    return token
  }
}
