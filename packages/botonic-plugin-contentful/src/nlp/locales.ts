import { stemmerFor } from './stemmer'

// TODO convert to string enum
export type Locale = string
export const SPANISH = 'es'
export const CATALAN = 'ca'
export const ENGLISH = 'en'
export const PORTUGUESE = 'pt'
export const POLISH = 'pl'
export const RUSSIAN = 'ru'
export const TURKISH = 'tr'
export const ITALIAN = 'it'
export const FRENCH = 'fr'
export const GERMAN = 'de'
export const ROMANIAN = 'ro'
export const GREEK = 'el'

export const SUPPORTED_LOCALES = [
  SPANISH,
  CATALAN,
  ENGLISH,
  PORTUGUESE,
  POLISH,
  RUSSIAN,
  TURKISH,
  ITALIAN,
  FRENCH,
  GERMAN,
  ROMANIAN,
  GREEK,
]

export function checkLocale(locale: Locale): Locale {
  // check it's supported
  stemmerFor(locale)
  return locale
}

export function rootLocale(locale: Locale): Locale {
  return locale.substr(0, 2)
}

export function buildLocale(lang: string, country: string | undefined): Locale {
  if (!country) {
    return lang.toLowerCase()
  }
  return lang.toLowerCase() + '-' + country.toUpperCase()
}

/**
 * Converts to lowercase, trims and removes accents
 */
export function preprocess(locale: Locale, text: string): string {
  text = text.trim().toLowerCase()
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
