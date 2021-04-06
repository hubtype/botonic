import { unique } from '../utils/array-utils'

export class OneHotEncoder {
  vocabulary: string[]

  constructor(vocabulary: string[]) {
    this.vocabulary = unique(vocabulary)
  }

  encode(sequence: string[]): number[][] {
    return sequence.map(token => this.encodeToken(token))
  }

  private encodeToken(token: string): number[] {
    if (!this.vocabulary.includes(token)) {
      throw new Error(`Invalid Token '${token}'.`)
    }
    const id = this.vocabulary.indexOf(token)
    return this.tokenIdToCategorical(id)
  }

  private tokenIdToCategorical(id: number): number[] {
    const categorical = Array(this.vocabulary.length).fill(0)
    categorical[id] = 1
    return categorical
  }

  decode(sequence: number[][]): string[] {
    return sequence.map(categorical => this.decodeCategorical(categorical))
  }

  private decodeCategorical(categorical: number[]): string {
    const id = this.categoricalToTokenId(categorical)
    return this.vocabulary[id]
  }

  private categoricalToTokenId(categorical: number[]): number {
    if (categorical.length !== this.vocabulary.length) {
      throw new Error(`Invalid categorical length '${categorical.length}'.`)
    }
    return categorical.indexOf(Math.max(...categorical))
  }
}
