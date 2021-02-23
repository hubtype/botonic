import { PreprocessEngines, SequencePosition } from './types'

export class Preprocessor {
  constructor(
    public readonly maxLength: number,
    private readonly engines: PreprocessEngines
  ) {}

  protected normalize(text: string): string {
    return this.engines.normalizer
      ? this.engines.normalizer.normalize(text)
      : text
  }

  protected tokenize(text: string): string[] {
    return this.engines.tokenizer
      ? this.engines.tokenizer.tokenize(text)
      : text.split(' ')
  }

  protected removeStopwords(tokens: string[]): string[] {
    return this.engines.stopwords
      ? tokens.filter(t => !this.engines.stopwords.includes(t))
      : tokens
  }

  protected stem(tokens: string[]): string[] {
    return this.engines.stemmer
      ? tokens.map(t => this.engines.stemmer.stem(t))
      : tokens
  }

  protected pad(
    tokens: string[],
    position: SequencePosition,
    value: string
  ): string[] {
    const difference = this.maxLength - tokens.length
    if (difference > 0) {
      const padd = Array(difference).fill(value)
      return position == 'post' ? padd.concat(tokens) : tokens.concat(padd)
    } else {
      return tokens
    }
  }

  protected truncate(tokens: string[], position: SequencePosition): string[] {
    return position == 'pre'
      ? tokens.slice(-this.maxLength)
      : tokens.slice(0, this.maxLength)
  }
}
