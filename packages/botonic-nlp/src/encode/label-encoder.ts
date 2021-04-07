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
    if (!this.vocabulary.includes(token)) {
      throw new Error(`Invalid Token '${token}'.`)
    }
    return this.vocabulary.indexOf(token)
  }

  decode(sequence: number[]): string[] {
    return sequence.map(id => this.decodeTokenId(id))
  }

  private decodeTokenId(id: number): string {
    if (id < 0 || id >= this.vocabulary.length) {
      throw new Error(`Invalid Token id '${id}'.`)
    }
    return this.vocabulary[id]
  }
}
