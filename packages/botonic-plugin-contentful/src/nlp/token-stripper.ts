import { equalArrays } from '../util/arrays'
import { NormalizedUtterance, Normalizer } from './normalizer'
import { Locale } from './locales'
import { TokenSkipper } from './token-skipper'

export class TokenRange {
  constructor(readonly from: number, readonly to: number) {}
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
      this.needleTokensByPos[pos] = needlesByPos[pos].map(n =>
        normalizer.normalize(locale, n).words.map(w => w.token)
      )
    }
  }

  /**
   * tokens do not to previously remove stopwords which may occur in needles
   */
  search(input: NormalizedUtterance, pos: number): TokenRange | undefined {
    const tokens = input.words.map(w => w.token)
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
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const range = this.search(
        this.normalizer.normalize(this.locale, haystack),
        pos
      )
      if (!range) {
        return haystack
      }
      switch (pos) {
        case TokenStripper.START_POSITION: {
          const idx = skipper.skipWords(haystack, range.to, true)
          haystack = haystack.substr(idx)
          break
        }
        case TokenStripper.END_POSITION: {
          const idx = skipper.skipWords(haystack, range.from, false)
          haystack = haystack.substr(0, idx)
          break
        }
        default:
          throw new Error(`Invalid search position ${pos}`)
      }
    }
  }
}
