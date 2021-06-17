import { Locale } from '../../types'
import { Stopwords } from '../types'
import { STOPWORDS_EN } from './en/stopwords-en'
import { STOPWORDS_ES } from './es/stopwords-es'
import { STOPWORDS_IT } from './it/stopwords-it'
import { STOPWORDS_RU } from './ru/stopwords-ru'

const STOPWORDS = {
  en: STOPWORDS_EN,
  es: STOPWORDS_ES,
  it: STOPWORDS_IT,
  ru: STOPWORDS_RU,
}

export function getStopwords(locale: Locale): Stopwords {
  if (!(locale in STOPWORDS)) {
    throw new Error(`No Stopwords configured for locale '${locale}'`)
  }
  return STOPWORDS[locale]
}
