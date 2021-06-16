import { Locale } from '../../types'
import { Tokenizer } from '../types'
import { TokenizerEn } from './en/tokenizer-en'
import { TokenizerEs } from './es/tokenizer-es'
import { TokenizerIt } from './it/tokenizer-it'

const TOKENIZERS = {
  en: new TokenizerEn(),
  es: new TokenizerEs(),
  it: new TokenizerIt(),
}

export function getTokenizer(locale: Locale): Tokenizer {
  if (!(locale in TOKENIZERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return TOKENIZERS[locale]
}
