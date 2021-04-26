import { IndexedItems } from './indexed-items'

type OneHotVector = number[]

export class OneHotEncoder {
  constructor(readonly items: IndexedItems) {}

  encode(sequence: string[]): OneHotVector[] {
    return sequence.map(item => this.encodeItem(item))
  }

  private encodeItem(item: string): OneHotVector {
    const idx = this.items.getIndex(item)
    return this.indexToOneHotVector(idx)
  }

  private indexToOneHotVector(idx: number): OneHotVector {
    const vector = Array(this.items.length).fill(0)
    vector[idx] = 1
    return vector
  }

  decode(sequence: OneHotVector[]): string[] {
    return sequence.map(vector => this.decodeOneHotVector(vector))
  }

  private decodeOneHotVector(vector: OneHotVector): string {
    const idx = this.oneHotVectorToIndex(vector)
    return this.items.getItem(idx)
  }

  private oneHotVectorToIndex(vector: OneHotVector): number {
    if (vector.length !== this.items.length) {
      throw new Error(`Invalid categorical length '${vector.length}'.`)
    }
    return vector.indexOf(Math.max(...vector))
  }
}
