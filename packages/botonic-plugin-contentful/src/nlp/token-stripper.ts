import { ValueObject } from '../util'
import { equalArrays } from '../util/arrays'
import { Locale, preprocess } from './locales'
import { Normalizer } from './normalizer'
import { TokenSkipper } from './token-skipper'
import { DEFAULT_SEPARATORS_REGEX } from './tokens'

export class TokenRange implements ValueObject {
  constructor(
    readonly from: number,
    readonly to: number
  ) {}

  equals(other: TokenRange): boolean {
    return this.from == other.from && this.to == other.to
  }

  toString(): string {
    return `from ${this.from} to ${this.to}`
  }
}

/**
 * Remove a substring if it matches from a list of provided strings, and it
 * occurs at the specified position (start or end).
 * It removes all separators between the stripped and the remaining parts.
 * It preprocesses the strings (separators, capitals, accents) but apart
 * from that the tokens must be identical
 */
export class TokenStripper {
  public static START_POSITION = 0
  public static END_POSITION = 1
  needleTokensByPos: { [position: number]: string[][] }
  constructor(
    needlesByPos: { [position: number]: string[] },
    readonly locale: Locale,
    readonly normalizer = new Normalizer()
  ) {
    this.needleTokensByPos = {}
    for (const pos in needlesByPos) {
      // we sort them to avoid stripping "buenas" before "buenas tardes"
      const firstLongest = (s1: string, s2: string) => {
        return s2.length - s1.length
      }
      this.needleTokensByPos[pos] = needlesByPos[pos]
        .sort(firstLongest)
        .map(n => normalizer.normalize(locale, n).words.map(w => w.token))
    }
  }

  /**
   * tokens do not to previously remove stopwords which may occur in needles
   */
  search(tokens: string[], pos: number): TokenRange | undefined {
    for (const needle of this.needleTokensByPos[pos] || []) {
      let range: TokenRange
      if (pos === TokenStripper.START_POSITION) {
        range = new TokenRange(0, needle.length)
      } else if (pos === TokenStripper.END_POSITION) {
        range = new TokenRange(tokens.length - needle.length, tokens.length)
      } else {
        throw new Error(`Invalid search position ${pos}`)
      }
      const chunk = tokens.slice(range.from, range.to)
      if (equalArrays(chunk, needle)) {
        return range
      }
    }
    return undefined
  }

  strip(haystack: string, pos: number): string {
    const skipper = new TokenSkipper()
    let tokens = preprocess(this.locale, haystack)
      .split(DEFAULT_SEPARATORS_REGEX)
      .filter(t => !!t)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const range = this.search(tokens, pos)
      if (!range) {
        return haystack
      }
      const last = haystack
      switch (pos) {
        case TokenStripper.START_POSITION: {
          const idx = skipper.skipWords(haystack, range.to, true)
          haystack = haystack.substr(idx)
          tokens = tokens.slice(range.to)
          break
        }
        case TokenStripper.END_POSITION: {
          const idx = skipper.skipWords(haystack, range.from, false)
          haystack = haystack.substr(0, idx)
          tokens = tokens.slice(0, range.from)
          break
        }
        default:
          throw new Error(`Invalid search position ${pos}`)
      }
      if (last == haystack) {
        console.error(`Could not skip ${range.toString()} from ${haystack}`)
        return haystack
      }
    }
  }
}
