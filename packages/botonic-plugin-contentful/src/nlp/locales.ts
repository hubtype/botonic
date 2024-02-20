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
export const CZECH = 'cs'
export const UKRAINIAN = 'uk'
export const CROATIAN = 'hr'
export const SLOVAK = 'sk'
export const SLOVENIAN = 'sl'
export const HUNGARIAN = 'hu'
export const DUTCH = 'nl'
export const BULGARIAN = 'bg'

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
  CZECH,
  UKRAINIAN,
  CROATIAN,
  SLOVAK,
  SLOVENIAN,
  HUNGARIAN,
  DUTCH,
  BULGARIAN,
]

export function checkLocale(locale: Locale): Locale {
  // will throw exception if not supported
  stemmerFor(locale)
  return locale
}

export function languageFromLocale(locale: Locale): string {
  return locale.substr(0, 2).toLowerCase()
}

/**
 * @return "" when no country available
 */
export function countryFromLocale(locale: Locale): string {
  return locale.substr(3).toUpperCase()
}

export function fixLocale(locale: Locale): Locale {
  return buildLocale(languageFromLocale(locale), countryFromLocale(locale))
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
export function preprocess(_locale: Locale, text: string): string {
  text = text.trim().toLowerCase()
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
