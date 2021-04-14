import { Locale } from '../../types'
import { STOPWORDS_EN } from './en/stopwords-en'
import { STOPWORDS_ES } from './es/stopwords-es'
import { Stopwords } from './types'

const STOPWORDS = {
  en: STOPWORDS_EN,
  es: STOPWORDS_ES,
}

export function getStopwords(locale: Locale): Stopwords {
  if (!(locale in STOPWORDS)) {
    throw new Error(`No Stopwords configured for locale '${locale}'`)
  }
  return STOPWORDS[locale]
}
