import { Dataset } from '../dataset/dataset'
import { flatten, unique } from '../utils/array-utils'
import { PADDING_TOKEN } from './constants'
import { Preprocessor } from './preprocessor'

export class Vocabulary {
  readonly tokens: string[]
  readonly length: number

  constructor(tokens: string[]) {
    this.tokens = unique(tokens)
    this.length = this.tokens.length
  }

  static fit(dataset: Dataset, preprocessor: Preprocessor): Vocabulary {
    const sequences = dataset.samples.map(sample =>
      preprocessor.preprocess(sample.text, PADDING_TOKEN)
    )
    const tokens = flatten(sequences)
    const uniqueTokens = unique(tokens)
    const filteredTokens = uniqueTokens.filter(token => token !== PADDING_TOKEN)
    return new Vocabulary(filteredTokens)
  }

  includes(token: string): boolean {
    return this.tokens.includes(token)
  }

  getTokenId(token: string): number {
    if (!this.includes(token)) {
      throw new Error(`Token '${token}' not found in vocabulary.`)
    }
    return this.tokens.indexOf(token)
  }

  getToken(id: number): string {
    if (!this.isValidId(id)) {
      throw new Error(`Invalid Token Id '${id}'.`)
    }
    return this.tokens[id]
  }

  private isValidId(id: number): boolean {
    return 0 <= id && id < this.length
  }
}
