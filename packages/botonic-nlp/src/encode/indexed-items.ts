import { unique } from '../utils/array-utils'

export class IndexedItems {
  readonly items: string[]

  constructor(items: string[]) {
    this.items = unique(items)
  }

  includes(item: string): boolean {
    return this.items.includes(item)
  }

  getIndex(item: string): number {
    const idx = this.items.indexOf(item)
    if (idx === -1) {
      throw new Error(`Item '${item}' not found.`)
    }
    return idx
  }

  getItem(idx: number): string {
    if (!this.isValidIndex(idx)) {
      throw new Error(`Invalid index '${idx}'.`)
    }
    return this.items[idx]
  }

  private isValidIndex(idx: number): boolean {
    return 0 <= idx && idx < this.length
  }

  get length(): number {
    return this.items.length
  }
}
