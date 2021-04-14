import { Locale } from '../types'
import { getNormalizer } from './engines/normalizer'
// import { getStemmer } from './engines/stemmer'
import { getStopwords } from './engines/stopwords'
import { getTokenizer } from './engines/tokenizer'
import { Normalizer, Stemmer, Stopwords, Tokenizer } from './types'

export enum SEQUENCE_POSITION {
  PRE,
  POST,
}

export type Engines = {
  normalizer?: Normalizer
  tokenizer?: Tokenizer
  stopwords?: Stopwords
  stemmer?: Stemmer
}

export class Preprocessor {
  engines: Engines = {}

  constructor(readonly locale: Locale, readonly maxLength: number) {
    this.loadEngines()
  }

  private loadEngines() {
    try {
      this.engines.normalizer = getNormalizer(this.locale)
      this.engines.tokenizer = getTokenizer(this.locale)
      this.engines.stopwords = getStopwords(this.locale)
      // this.engines.stemmer = getStemmer(this.locale)
    } catch {
      console.warn(
        `Engines not implemented for locale "${this.locale}". Using default.`
      )
    }
  }

  preprocess(text: string, paddingValue: string): string[] {
    const normalizedText = this.normalize(text)
    const tokens = this.tokenize(normalizedText)
    const filteredTokens = this.removeStopwords(tokens)
    const stemmedTokens = this.stem(filteredTokens)
    const paddedSequence = this.pad(stemmedTokens, paddingValue)
    const truncatedSequence = this.truncate(paddedSequence)
    return truncatedSequence
  }

  normalize(text: string): string {
    return this.engines.normalizer
      ? this.engines.normalizer.normalize(text)
      : text.toLowerCase()
  }

  tokenize(text: string): string[] {
    return this.engines.tokenizer
      ? this.engines.tokenizer.tokenize(text)
      : text.split(' ')
  }

  removeStopwords(tokens: string[]): string[] {
    return this.engines.stopwords
      ? tokens.filter(t => !this.engines.stopwords.includes(t))
      : tokens
  }

  stem(tokens: string[]): string[] {
    return this.engines.stemmer ? this.engines.stemmer.stem(tokens) : tokens
  }

  pad(
    tokens: string[],
    value: string,
    position: SEQUENCE_POSITION = SEQUENCE_POSITION.POST
  ): string[] {
    const difference = this.maxLength - tokens.length
    if (difference > 0) {
      const padd = Array(difference).fill(value)
      return position === SEQUENCE_POSITION.PRE
        ? padd.concat(tokens)
        : tokens.concat(padd)
    }
    return tokens
  }

  truncate(
    tokens: string[],
    position: SEQUENCE_POSITION = SEQUENCE_POSITION.POST
  ): string[] {
    const difference = this.maxLength - tokens.length
    if (difference < 0) {
      return position === SEQUENCE_POSITION.PRE
        ? tokens.slice(-this.maxLength)
        : tokens.slice(0, this.maxLength)
    }
    return tokens
  }
}
