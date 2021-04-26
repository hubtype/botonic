import { IndexedItems } from './indexed-items'

export class LabelEncoder {
  constructor(readonly items: IndexedItems) {}

  encode(sequence: string[]): number[] {
    return sequence.map(item => this.items.getIndex(item))
  }

  decode(sequence: number[]): string[] {
    return sequence.map(idx => this.items.getItem(idx))
  }
}
