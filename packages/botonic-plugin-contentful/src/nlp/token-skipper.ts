import {
  DEFAULT_NOT_SEPARATORS_REGEX,
  DEFAULT_SEPARATORS_REGEX,
} from './tokens'

export class TokenSkipper {
  private readonly notClosingSeparator: RegExp
  constructor(
    private readonly separators = DEFAULT_SEPARATORS_REGEX,
    private readonly notSeparators = DEFAULT_NOT_SEPARATORS_REGEX
  ) {
    this.notClosingSeparator = /[^?!)]/g
  }

  /**
   * Eg. skipWords('a? b',1, false) => 1
   * @param text
   * @param skipWordsCount how many words to skip
   * @param skipClosingSeparators whether characters like ? must be skipped
   */
  skipWords(
    text: string,
    skipWordsCount: number,
    skipClosingSeparators: boolean
  ): number {
    let idx = 0
    for (let w = 0; w < skipWordsCount; w++) {
      idx = this.skipSeparators(text, idx, this.notSeparators)
      if (idx >= 0) {
        idx = this.skipWord(text, idx)
      }
      if (idx < 0) {
        if (w < skipWordsCount - 1) {
          throw new Error(
            `skipWords('${text}', ${skipWordsCount}} failed because it only has ${w} words`
          )
        }
      }
    }
    if (idx >= 0) {
      idx = this.skipSeparators(
        text,
        idx,
        skipClosingSeparators ? this.notSeparators : this.notClosingSeparator
      )
    }
    if (idx < 0) {
      return text.length
    }
    return idx
  }

  private skipWord(text: string, offset: number): number {
    const idx = text.substr(offset).search(this.separators)
    if (idx < 0) {
      return idx
    }
    return idx + offset
  }

  private skipSeparators(text: string, offset: number, seps: RegExp): number {
    const idx = text.substr(offset).search(seps)
    if (idx < 0) {
      return idx
    }
    return idx + offset
  }
}
