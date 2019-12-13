import {
  DEFAULT_NOT_SEPARATORS_REGEX,
  DEFAULT_SEPARATORS_REGEX,
} from './tokens'

/**
 *
 */
export class TokenSkipper {
  constructor(
    readonly separators = DEFAULT_SEPARATORS_REGEX,
    readonly notSeparators = DEFAULT_NOT_SEPARATORS_REGEX
  ) {}

  /**
   * Returns the index within a text after skipping some words
   */
  skipWords(
    text: string,
    skipWordsCount: number,
    skipFinalSeparators: boolean
  ): number {
    let idx = 0
    for (let w = 0; w < skipWordsCount; w++) {
      idx = this.skipSeparators(text, idx)
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
    if (skipFinalSeparators && idx >= 0) {
      idx = this.skipSeparators(text, idx)
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

  private skipSeparators(text: string, offset: number): number {
    const idx = text.substr(offset).search(this.notSeparators)
    if (idx < 0) {
      return idx
    }
    return idx + offset
  }
}
