import { unique } from '../utils/array-utils'

export class OneHotCodifier {
  vocabulary: string[]

  constructor(vocabulary: string[]) {
    this.vocabulary = unique(vocabulary)
  }

  encode(sequence: string[]): number[][] {
    return sequence.map(token => this.encodeToken(token))
  }

  private encodeToken(token: string): number[] {
    if (!this.isValidToken(token)) {
      throw new Error(`Invalid Token '${token}'.`)
    }
    const id = this.vocabulary.indexOf(token)
    return this.tokenIdToCategorical(id)
  }

  private isValidToken(token: string): boolean {
    return this.vocabulary.includes(token)
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
    if (!this.isValidCategorical(categorical)) {
      throw new Error(`Invalid categorical length '${categorical.length}'.`)
    }
    return categorical.indexOf(Math.max(...categorical))
  }

  private isValidCategorical(categorical: number[]): boolean {
    return categorical.length == this.vocabulary.length
  }
}
