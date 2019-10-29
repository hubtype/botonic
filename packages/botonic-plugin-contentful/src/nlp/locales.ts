import { stemmerFor } from './stemmer'

export type Locale = string

export function checkLocale(locale?: Locale): Locale {
  if (!locale) {
    throw new Error('Context.locale must be specified')
  }
  // check it's supported
  stemmerFor(locale)
  return locale
}

/**
 * Converts to lowercase and removes accents
 */
export function normalize(locale: Locale, text: string): string {
  text = text.trim().toLowerCase()
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
