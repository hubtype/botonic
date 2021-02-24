import { UNKNOWN_TOKEN } from './constants'

export class Codifier {
  private constructor(
    readonly vocabulary: string[],
    readonly categorical: boolean,
    readonly allowUnknown: boolean
  ) {}

  static with(
    vocabulary: string[],
    categorical: boolean,
    allowUnknown: boolean
  ): Codifier {
    if (allowUnknown) {
      vocabulary = [UNKNOWN_TOKEN].concat(vocabulary)
    }
    vocabulary = Array.from(new Set(vocabulary))
    return new Codifier(vocabulary, categorical, allowUnknown)
  }

  static fit(
    sequences: string[][],
    categorical: boolean,
    allowUnknown: boolean,
    defaultVocabulary: string[] = []
  ): Codifier {
    if (allowUnknown) {
      defaultVocabulary.push(UNKNOWN_TOKEN)
    }
    sequences.forEach(s => (defaultVocabulary = defaultVocabulary.concat(s)))
    const vocabulary = Array.from(new Set(defaultVocabulary))
    return new Codifier(vocabulary, categorical, allowUnknown)
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
        if (this.allowUnknown) {
          return this.vocabulary.indexOf(UNKNOWN_TOKEN)
        } else {
          throw new Error(`Token "${t}" not included in the vocabulary.`)
        }
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
    return sequence.map(t => this.vocabulary[t])
  }
}
