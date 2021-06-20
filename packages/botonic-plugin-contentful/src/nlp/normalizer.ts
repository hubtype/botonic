import { DynamicSingletonMap } from '../util'
import { equalArrays } from '../util/arrays'
import { Locale } from './locales'
import { stemmerFor } from './stemmer'
import {
  DEFAULT_SEPARATORS,
  DEFAULT_SEPARATORS_REGEX,
  stopWordsFor,
  tokenizerPerLocale,
} from './tokens'
import { replaceAll } from './util/strings'

/**
 * Both tokens and stem will be converted to the <code>stem</code>
 * Tokens will be searched case-insensitively.
 */
export class StemmingBlackList {
  readonly stem: string
  readonly tokens: string[]

  constructor(stem: string, tokens: string[]) {
    this.stem = stem.toLowerCase()
    this.tokens = tokens.map(t => t.toLowerCase())
  }

  normalize(normalizer: (str: string) => string): StemmingBlackList {
    return new StemmingBlackList(
      normalizer(this.stem),
      this.tokens.map(normalizer)
    )
  }

  isBlackListed(token: string): boolean {
    return token == this.stem || this.tokens.includes(token)
  }
}

export class Word {
  /**
   * @param token lowercase, with i18n characters converted to ascii and after executing Preprocessor
   * @param stem lowercase, stemmed. Same as token for stopwords
   */
  constructor(
    readonly token: string,
    readonly stem: string,
    readonly isStopWord = false
  ) {}

  static joinedTokens(words: Word[], withStopwords: boolean): string {
    if (!withStopwords) {
      words = words.filter(w => !w.isStopWord)
    }
    return words.map(w => w.token).join(' ')
  }

  static StopWord(token: string): Word {
    return new Word(token, token, true)
  }
}

export class EmptyTextException extends Error {
  constructor(txt: string) {
    super(`'${txt}' not accepted because it only contains separators`)
  }
}

export class NormalizedUtterance {
  /** Without stopwords */
  readonly stems: string[]

  /**
   * @param onlyStopWords: true iff all tokens are stop words
   */
  constructor(
    /** raw is actually lowercased and trimmed*/
    readonly raw: string,
    readonly words: Word[],
    private readonly onlyStopWords = false
  ) {
    this.stems = words.filter(w => !w.isStopWord).map(w => w.stem)
  }

  hasOnlyStopWords(): boolean {
    return this.onlyStopWords
  }

  hasSameStems(other: NormalizedUtterance): boolean {
    return equalArrays(this.stems, other.stems)
  }

  joinedTokens(withStopWords: boolean): string {
    return Word.joinedTokens(this.words, withStopWords)
  }
}

export abstract class Preprocessor {
  abstract preprocess(txt: string): string
}

export class NopPreprocessor {
  preprocess(txt: string): string {
    return txt
  }
}

/**
 * Removes dots within acronyms, even if missing last dot,
 * or immediately followed by a different separator
 */
export class AcronymPreprocessor implements Preprocessor {
  private static readonly DOT = '.'
  private SEPS_NO_DOT: string
  constructor(separators: string) {
    this.SEPS_NO_DOT = separators.replace(AcronymPreprocessor.DOT, '')
  }

  preprocess(txt: string): string {
    if (!txt.includes(AcronymPreprocessor.DOT)) return txt
    const wordsAndSeparators = this.splitWordsAndSeparators(txt)
    txt = ''
    for (const wOrSep of wordsAndSeparators) {
      const isSeparator = wOrSep.includes(this.SEPS_NO_DOT)
      if (!isSeparator) {
        txt = txt + this.preprocessWord(wOrSep)
      } else {
        txt = txt + wOrSep
      }
    }
    return txt
  }

  private splitWordsAndSeparators(txt: string): string[] {
    let word = ''
    const ret: string[] = []
    const pushWord = () => {
      if (word) {
        ret.push(word)
        word = ''
      }
    }
    for (const l of txt) {
      if (this.SEPS_NO_DOT.includes(l)) {
        pushWord()
        ret.push(l)
      } else {
        word += l
      }
    }
    pushWord()
    return ret
  }

  private preprocessWord(w: string): string {
    if (w.length <= 2) {
      return w
    }
    let mustBeDot = false
    for (const l of w) {
      const isDot = l == AcronymPreprocessor.DOT
      if (isDot !== mustBeDot) {
        return w
      }
      mustBeDot = !mustBeDot
    }
    return replaceAll(w, AcronymPreprocessor.DOT, '')
  }
}

export class Normalizer {
  private stopWordsPerLocale: DynamicSingletonMap<string[]>
  private stemmingBlackListPerLocale: DynamicSingletonMap<StemmingBlackList[]>

  /**
   * preprocessor: Applied before tokenizing. Applied also to separators and stem words
   */
  constructor(
    stemmingBlackListPerLocale: {
      [locale: string]: StemmingBlackList[]
    } = {},
    stopWordsForLocale = stopWordsFor,
    private readonly tokenizer = tokenizerPerLocale,
    private readonly separatorsRegex = DEFAULT_SEPARATORS_REGEX,
    private readonly preprocessor = new AcronymPreprocessor(DEFAULT_SEPARATORS)
  ) {
    this.stopWordsPerLocale = new DynamicSingletonMap<string[]>(locale =>
      stopWordsForLocale(locale).map(w => this.normalizeWord(locale, w))
    )
    this.stemmingBlackListPerLocale = new DynamicSingletonMap<
      StemmingBlackList[]
    >(l =>
      (stemmingBlackListPerLocale[l] || []).map(bl =>
        bl.normalize(w => this.normalizeWord(l, w))
      )
    )
  }

  /**
   * @throws EmptyTextException if the text is empty or only contains separators
   */
  normalize(locale: Locale, raw: string): NormalizedUtterance {
    raw = raw.trim().toLowerCase() // TODO use preprocess without normalization? move to NormalizedUtterance constructor?
    let txt = this.preprocessor.preprocess(raw)
    txt = txt.replace(this.separatorsRegex, ' ')
    if (!txt.trim()) {
      throw new EmptyTextException(raw)
    }

    const stemmer = stemmerFor(locale)
    // tokenizer will replace i18n characters
    const tokens = this.tokenizer(locale).tokenize(txt, true)
    let words: Word[] = []
    const stopWords = this.stopWordsPerLocale.value(locale)
    let numStopWords = 0
    for (const token of tokens) {
      const blacklistedStem = this.getBlackListStem(locale, token)
      if (blacklistedStem) {
        words.push(new Word(token, blacklistedStem))
        continue
      }
      if (stopWords.includes(token)) {
        words.push(Word.StopWord(token))
        numStopWords++
        continue
      }
      // a token could generate 2 stems (eg can't => can not)
      const tokenStems = stemmer.stem([token])
      words = words.concat(tokenStems.map(stem => new Word(token, stem)))
    }
    return new NormalizedUtterance(raw, words, numStopWords == tokens.length)
  }

  private normalizeWord(locale: Locale, word: string): string {
    word = this.preprocessor.preprocess(word)
    return this.tokenizer(locale).tokenize(word.toLowerCase(), true).join(' ')
  }

  private getBlackListStem(locale: Locale, word: string): string | undefined {
    const blacks = this.stemmingBlackListPerLocale.value(locale)
    for (const black of blacks) {
      if (black.isBlackListed(word)) {
        return black.stem
      }
    }
    return undefined
  }
}
