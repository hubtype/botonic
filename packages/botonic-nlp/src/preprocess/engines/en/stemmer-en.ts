import * as PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer'

import { Stemmer } from '../../types'

export default class StemmerEn implements Stemmer {
  readonly locale = 'en'
  stem(text: string): string {
    return PorterStemmer.stem(text)
  }
}
