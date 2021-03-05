import * as PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer_es'

import { Stemmer } from '../../types'

export default class StemmerEs implements Stemmer {
  readonly locale = 'es'
  stem(text: string): string {
    return PorterStemmer.stem(text)
  }
}
