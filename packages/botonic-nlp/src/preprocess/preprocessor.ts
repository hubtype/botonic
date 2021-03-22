import { Locale } from '../types'
import { getNormalizer } from './engines/normalizer'
// import { getStemmer } from './engines/stemmer'
import { getStopwords } from './engines/stopwords'
import { getTokenizer } from './engines/tokenizer'
import { PaddingPosition, PreprocessEngines } from './types'

export class Preprocessor {
  engines: PreprocessEngines = {}

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    public paddingPosition: PaddingPosition = 'post'
  ) {
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

  normalize(text: string): string {
    return this.engines.normalizer
      ? this.engines.normalizer.normalize(text)
      : text
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

  pad(tokens: string[], value: string): string[] {
    const difference = this.maxLength - tokens.length
    if (difference > 0) {
      const padd = Array(difference).fill(value)
      return this.paddingPosition == 'pre'
        ? padd.concat(tokens)
        : tokens.concat(padd)
    } else if (difference < 0) {
      return this.paddingPosition == 'pre'
        ? tokens.slice(-this.maxLength)
        : tokens.slice(0, this.maxLength)
    } else {
      return tokens
    }
  }
}
