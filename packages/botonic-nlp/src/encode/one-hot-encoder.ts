import { unique } from '../utils/array-utils'

type OneHotVector = number[]

export class OneHotEncoder {
  vocabulary: string[]

  constructor(vocabulary: string[]) {
    this.vocabulary = unique(vocabulary)
  }

  encode(sequence: string[]): OneHotVector[] {
    return sequence.map(token => this.encodeToken(token))
  }

  private encodeToken(token: string): OneHotVector {
    if (!this.vocabulary.includes(token)) {
      throw new Error(`Invalid Token '${token}'.`)
    }
    const id = this.vocabulary.indexOf(token)
    return this.tokenIdToOneHotVector(id)
  }

  private tokenIdToOneHotVector(id: number): OneHotVector {
    const vector = Array(this.vocabulary.length).fill(0)
    vector[id] = 1
    return vector
  }

  decode(sequence: OneHotVector[]): string[] {
    return sequence.map(vector => this.decodeOneHotVector(vector))
  }

  private decodeOneHotVector(vector: OneHotVector): string {
    const id = this.oneHotVectorToTokenId(vector)
    return this.vocabulary[id]
  }

  private oneHotVectorToTokenId(vector: OneHotVector): number {
    if (vector.length !== this.vocabulary.length) {
      throw new Error(`Invalid categorical length '${vector.length}'.`)
    }
    return vector.indexOf(Math.max(...vector))
  }
}
