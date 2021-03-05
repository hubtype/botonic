import { Locale } from '../types'
import { PaddingPosition, PreprocessEngines } from './types'

export class Preprocessor {
  engines: PreprocessEngines = {}

  constructor(
    public readonly locale: Locale,
    public readonly maxLength: number,
    public readonly paddingPosition: PaddingPosition = 'post'
  ) {
    this.loadEngine('normalizer')
    this.loadEngine('tokenizer')
    this.loadEngine('stopwords')
    // TODO: In the future, if embeddings are disabled, stemmer should be loaded.
    //   this.loadEngine('stemmer')
  }

  private loadEngine(engineName: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const engine = require(`./engines/${this.locale}/${engineName}-${this.locale}`)
        .default
      this.engines[engineName] =
        engineName == 'stopwords' ? engine.stopwords : new engine()
    } catch {
      console.warn(
        `Engine "${engineName}" not implemented for locale "${this.locale}". Using default.`
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
    return this.engines.stemmer
      ? tokens.map(t => this.engines.stemmer.stem(t))
      : tokens
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
