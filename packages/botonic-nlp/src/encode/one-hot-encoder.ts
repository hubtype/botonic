import { Vocabulary } from '../preprocess/vocabulary'

type OneHotVector = number[]

export class OneHotEncoder {
  constructor(readonly vocabulary: Vocabulary) {}

  encode(sequence: string[]): OneHotVector[] {
    return sequence.map(token => this.encodeToken(token))
  }

  private encodeToken(token: string): OneHotVector {
    const id = this.vocabulary.getTokenId(token)
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
    return this.vocabulary.getToken(id)
  }

  private oneHotVectorToTokenId(vector: OneHotVector): number {
    if (vector.length !== this.vocabulary.length) {
      throw new Error(`Invalid categorical length '${vector.length}'.`)
    }
    return vector.indexOf(Math.max(...vector))
  }
}
