import { Locale } from '../../types'
import { Normalizer } from '../types'
import { NormalizerEn } from './en/normalizer-en'
import { NormalizerEs } from './es/normalizer-es'
import { NormalizerIt } from './it/normalizer-it'
import { NormalizerRu } from './ru/normalizer-ru'

const NORMALIZERS = {
  en: new NormalizerEn(),
  es: new NormalizerEs(),
  it: new NormalizerIt(),
  ru: new NormalizerRu(),
}

export function getNormalizer(locale: Locale): Normalizer {
  if (!(locale in NORMALIZERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return NORMALIZERS[locale]
}
