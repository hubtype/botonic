import { Locale } from '../../types'
import { Stemmer } from '../types'
import { StemmerEn } from './en/stemmer-en'
import { StemmerEs } from './es/stemmer-es'
import { StemmerIt } from './it/stemmer-it'
import { StemmerRu } from './ru/stemmer-ru'

const STEMMERS = {
  en: new StemmerEn(),
  es: new StemmerEs(),
  it: new StemmerIt(),
  ru: new StemmerRu(),
}

export function getStemmer(locale: Locale): Stemmer {
  if (!(locale in STEMMERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return STEMMERS[locale]
}
