// eslint-disable-next-line import/no-unresolved
import { StemmerEs as PorterStemmer } from '@nlpjs/lang-es/src/stemmer-es'

import { Stemmer } from '../../types'

export default class StemmerEs implements Stemmer {
  readonly locale = 'es'
  stem(text: string): string {
    return PorterStemmer.stem(text)
  }
}
