import { Locale } from '../../types'
import { TokenizerEn } from './en/tokenizer-en'
import { TokenizerEs } from './es/tokenizer-es'
import { Tokenizer } from './types'

const TOKENIZERS = {
  en: new TokenizerEn(),
  es: new TokenizerEs(),
}

export function getTokenizer(locale: Locale): Tokenizer {
  if (!(locale in TOKENIZERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return TOKENIZERS[locale]
}
