// From http://nlp.ffzg.hr/resources/tools/stemmer-for-croatian/

import Stemmer from '@nlpjs/core/src/stemmer'

import { hrDefaultStopWords } from '../stopwords/stopwords-hr'
import { hrRules } from './rules/rules-hr'
import { hrTransformations } from './transformations/transformations-hr'

export class StemmerHr implements Stemmer {
  stem(tokens: string[]): string[] {
    return tokens.map(token => this.stemToken(token))
  }

  private stemToken(token: string): string {
    if (this.isStopWord(token)) {
      return token
    } else {
      return this.getRoot(this.transform(token))
    }
  }

  private isStopWord(token: string): boolean {
    return hrDefaultStopWords.indexOf(token) != -1
  }

  private transform(token: string): string {
    for (const replacement in hrTransformations) {
      const targets = hrTransformations[replacement]
      for (const target of targets) {
        if (token.endsWith(target)) {
          return token.replace(target, replacement)
        }
      }
    }
    return token
  }

  private getRoot(token: string): string {
    for (const rule of hrRules) {
      const match = new RegExp(rule).exec(token)
      if (match) {
        const root = match[1]
        if (this.containsVocal(root) && root.length > 1) {
          return root
        }
      }
    }
    return token
  }

  private containsVocal(token: string): boolean {
    token = this.highlightRSyllable(token)
    if (token.search(/[aeiouR]/) == undefined) {
      return false
    } else {
      return true
    }
  }

  private highlightRSyllable(token: string): string {
    // eslint-disable-next-line no-useless-escape
    return token.replace(/(^|[^aeiou])r($|[^aeiou])/gm, `\$1R\$2`)
  }
}
