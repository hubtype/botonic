import { Locale } from '../types'

export interface Normalizer {
  readonly locale: Locale
  normalize(text: string): string
}

export interface Stemmer {
  readonly locale: Locale
  stem(text: string): string
}

export interface Tokenizer {
  readonly locale: Locale
  tokenize(text: string): string[]
}

export type Stopwords = string[]

export type PreprocessEngines = {
  normalizer?: Normalizer
  tokenizer?: Tokenizer
  stopwords?: Stopwords
  stemmer?: Stemmer
}

export type SequencePosition = 'pre' | 'post'
