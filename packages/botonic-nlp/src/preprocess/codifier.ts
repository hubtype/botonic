export class Codifier {
  categorical: boolean

  constructor(public vocabulary: string[], args = { categorical: false }) {
    this.vocabulary = Array.from(new Set(vocabulary))
    this.categorical = args.categorical
  }

  encode(sequence: string[]): number[] | number[][] {
    return this.categorical
      ? this.toCategorical(this.encodeSequence(sequence))
      : this.encodeSequence(sequence)
  }

  private encodeSequence(sequence: string[]): number[] {
    return sequence.map(t => {
      const i = this.vocabulary.indexOf(t)
      if (i == -1) {
        throw new Error(`Token "${t}" not included in the vocabulary.`)
      } else {
        return i
      }
    })
  }

  private toCategorical(sequence: number[]): number[][] {
    return sequence.map(t => {
      const categoricalArray = Array(this.vocabulary.length).fill(0)
      categoricalArray[t] = 1
      return categoricalArray
    })
  }

  decode(sequence: number[] | number[][]): string[] {
    return this.categorical
      ? this.decodeSequence(this.fromCategorical(sequence as number[][]))
      : this.decodeSequence(sequence as number[])
  }

  private fromCategorical(sequence: number[][]): number[] {
    return sequence.map(a => a.indexOf(Math.max(...a)))
  }

  private decodeSequence(sequence: number[]): string[] {
    return sequence.map(id => {
      const token = this.vocabulary[id]
      if (token) {
        return token
      } else {
        throw new RangeError(`Token id "${id}" out of range.`)
      }
    })
  }
}
