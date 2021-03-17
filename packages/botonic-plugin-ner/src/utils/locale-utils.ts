import { Locale } from '@botonic/nlp/dist/types'
import franc from 'franc'
import langs from 'langs'

export function detectLocale(input: string, locales: Locale[]): Locale {
  const res = franc(input, {
    whitelist: locales.map(locale => langs.where('1', locale)[3]),
  })
  if (res === 'und') return locales[0]
  return langs.where('3', res)[1] as Locale
}
