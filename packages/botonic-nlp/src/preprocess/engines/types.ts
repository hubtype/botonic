import { Locale } from '../../types'

export interface Normalizer {
  readonly locale: Locale
  normalize(text: string): string
}

export interface Stemmer {
  readonly locale: Locale
  stem(tokens: string[]): string[]
}

export interface Tokenizer {
  readonly locale: Locale
  tokenize(text: string): string[]
}

export type Stopwords = string[]
