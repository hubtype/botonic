import { unique } from '../utils/array-utils'

export class LabelEncoder {
  vocabulary: string[]

  constructor(vocabulary: string[]) {
    this.vocabulary = unique(vocabulary)
  }

  encode(sequence: string[]): number[] {
    return sequence.map(token => this.encodeToken(token))
  }

  private encodeToken(token: string): number {
    if (!this.isValidToken(token)) {
      throw new Error(`Invalid Token '${token}'.`)
    }
    return this.vocabulary.indexOf(token)
  }

  private isValidToken(token: string): boolean {
    return this.vocabulary.includes(token)
  }

  decode(sequence: number[]): string[] {
    return sequence.map(id => this.decodeTokenId(id))
  }

  private decodeTokenId(id: number): string {
    if (!this.isValidTokenId(id)) {
      throw new Error(`Invalid Token id '${id}'.`)
    }
    return this.vocabulary[id]
  }

  private isValidTokenId(id: number) {
    return this.vocabulary.length > id && id >= 0
  }
}
