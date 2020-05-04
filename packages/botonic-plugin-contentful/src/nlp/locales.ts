import { stemmerFor } from './stemmer'

// TODO convert to string enum
export type Locale = string
export const SPANISH = 'es'
export const CATALAN = 'ca'
export const ENGLISH = 'en'
export const PORTUGUESE = 'pt'
export const POLISH = 'pl'
export const RUSSIAN = 'ru'

export const SUPPORTED_LOCALES = [
  SPANISH,
  CATALAN,
  ENGLISH,
  PORTUGUESE,
  POLISH,
  RUSSIAN,
]

export function checkLocale(locale: Locale): Locale {
  // check it's supported
  stemmerFor(locale)
  return locale
}

/**
 * Converts to lowercase, trims and removes accents
 */
export function preprocess(locale: Locale, text: string): string {
  text = text.trim().toLowerCase()
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
