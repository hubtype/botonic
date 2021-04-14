import { Locale } from '../../types'
import { StemmerEn } from './en/stemmer-en'
import { StemmerEs } from './es/stemmer-es'
import { Stemmer } from './types'

const STEMMERS = {
  en: new StemmerEn(),
  es: new StemmerEs(),
}

export function getStemmer(locale: Locale): Stemmer {
  if (!(locale in STEMMERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return STEMMERS[locale]
}
