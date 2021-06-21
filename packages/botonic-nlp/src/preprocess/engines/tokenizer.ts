import { Locale } from '../../types'
import { Tokenizer } from '../types'
import { TokenizerDe } from './de/tokenizer-de'
import { TokenizerEn } from './en/tokenizer-en'
import { TokenizerEs } from './es/tokenizer-es'
import { TokenizerIt } from './it/tokenizer-it'
import { TokenizerRu } from './ru/tokenizer-ru'

const TOKENIZERS = {
  de: new TokenizerDe(),
  en: new TokenizerEn(),
  es: new TokenizerEs(),
  it: new TokenizerIt(),
  ru: new TokenizerRu(),
}

export function getTokenizer(locale: Locale): Tokenizer {
  if (!(locale in TOKENIZERS)) {
    throw new Error(`No Stemmer configured for locale '${locale}'`)
  }
  return TOKENIZERS[locale]
}
