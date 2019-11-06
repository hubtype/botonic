import { stemmerFor } from './stemmer'
import {
  DEFAULT_SEPARATORS_REGEX,
  DEFAULT_STOP_WORDS,
  tokenizerPerLocale,
} from './tokens'
import { Locale } from './locales'

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
   * @param token lowercase, with i18n characters converted to ascii
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

export class NormalizedUtterance {
  /** Without stopwords */
  stems: string[]

  /*
   * onlyStopWords tokens are all stop words
   */
  constructor(
    readonly raw: string,
    readonly words: Word[],
    private readonly onlyStopWords = false
  ) {
    this.stems = words.filter(w => !w.isStopWord).map(w => w.stem)
  }

  hasOnlyStopWords(): boolean {
    return this.onlyStopWords
  }
}

export class Normalizer {
  private stopWordsPerLocale: typeof DEFAULT_STOP_WORDS = {}
  private stemmingBlackListPerLocale: {
    [locale: string]: StemmingBlackList[]
  } = {}

  constructor(
    stemmingBlackListPerLocale: { [locale: string]: StemmingBlackList[] } = {},
    stopWordsPerLocale = DEFAULT_STOP_WORDS,
    private readonly tokenizer = tokenizerPerLocale,
    private readonly separatorsRegex = DEFAULT_SEPARATORS_REGEX
  ) {
    for (const locale in stemmingBlackListPerLocale) {
      const blacks = stemmingBlackListPerLocale[locale].map(black =>
        black.normalize(txt => this.normalizeWord(locale, txt))
      )
      this.stemmingBlackListPerLocale[locale] = blacks
    }

    for (const locale in stopWordsPerLocale) {
      this.stopWordsPerLocale[locale] = stopWordsPerLocale[locale].map(sw =>
        this.normalizeWord(locale, sw)
      )
    }
  }

  normalize(locale: Locale, txt: string): NormalizedUtterance {
    txt = txt.toLowerCase()
    txt = txt.replace(this.separatorsRegex, ' ')
    const stemmer = stemmerFor(locale)
    // tokenizer will replace i18n characters
    const tokens = this.tokenizer(locale).tokenize(txt, true)
    let words: Word[] = []
    const stopWords = this.stopWordsPerLocale[locale]
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
      const tokenStems = stemmer.tokenizeAndStem(token, true)
      words = words.concat(tokenStems.map(stem => new Word(token, stem)))
    }
    return new NormalizedUtterance(txt, words, numStopWords == tokens.length)
  }

  private normalizeWord(locale: Locale, stopWord: string): string {
    return this.tokenizer(locale)
      .tokenize(stopWord.toLowerCase(), true)
      .join(' ')
  }

  private getBlackListStem(locale: Locale, word: string): string | undefined {
    const blacks = this.stemmingBlackListPerLocale[locale] || []
    for (const black of blacks) {
      if (black.isBlackListed(word)) {
        return black.stem
      }
    }
    return undefined
  }
}
