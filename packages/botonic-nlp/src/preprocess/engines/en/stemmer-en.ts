// eslint-disable-next-line import/no-unresolved
import { StemmerEn as PorterStemmer } from '@nlpjs/lang-en-min/src/stemmer-en'

import { Stemmer } from '../../types'

export default class StemmerEn implements Stemmer {
  readonly locale = 'en'
  stem(text: string): string {
    return PorterStemmer.stem(text)
  }
}
