import { Locale } from '../../types'
import { NormalizerEn } from './en/normalizer-en'
import { NormalizerEs } from './es/normalizer-es'
import { Normalizer } from './types'

const NORMALIZERS = {
  en: new NormalizerEn(),
  es: new NormalizerEs(),
}

export function getNormalizer(locale: Locale): Normalizer {
  if (!(locale in NORMALIZERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return NORMALIZERS[locale]
}
