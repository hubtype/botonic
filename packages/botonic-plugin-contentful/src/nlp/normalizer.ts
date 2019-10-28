import { stemmerFor } from './stemmer';
import {
  DEFAULT_SEPARATORS_REGEX,
  DEFAULT_STOP_WORDS,
  tokenizerPerLocale
} from './tokens';
import { Locale } from './locales';

/**
 * Both tokens and stem will be converted to the <code>stem</code>
 * Tokens will be searched case-insensitively.
 */
export class StemmingBlackList {
  readonly stem: string;
  readonly tokens: string[];
  constructor(stem: string, tokens: string[]) {
    this.stem = stem.toLowerCase();
    this.tokens = tokens.map(t => t.toLowerCase());
  }

  normalize(normalizer: (str: string) => string): StemmingBlackList {
    return new StemmingBlackList(
      normalizer(this.stem),
      this.tokens.map(normalizer)
    );
  }

  isBlackListed(token: string): boolean {
    return token == this.stem || this.tokens.includes(token);
  }
}

export class NormalizedUtterance {
  joinedStems: string;

  /**
   *
   * @param raw
   * @param tokens lowercase, with i18n characters converted to ascii
   * @param stems lowercase, stemmed. Equal to tokens if onlyStopWords==true
   * @param onlyStopWords tokens are all stop words
   */
  constructor(
    readonly raw: string,
    readonly tokens: string[],
    readonly stems: string[],
    private readonly onlyStopWords = false
  ) {
    this.joinedStems = stems.join(' ');
  }

  hasOnlyStopWords(): boolean {
    return this.onlyStopWords;
  }
}

export class Normalizer {
  private stopWordsPerLocale: typeof DEFAULT_STOP_WORDS = {};
  private stemmingBlackListPerLocale: {
    [locale: string]: StemmingBlackList[];
  } = {};

  constructor(
    stemmingBlackListPerLocale: { [locale: string]: StemmingBlackList[] } = {},
    stopWordsPerLocale = DEFAULT_STOP_WORDS,
    private readonly tokenizer = tokenizerPerLocale,
    private readonly separatorsRegex = DEFAULT_SEPARATORS_REGEX
  ) {
    for (const locale in stemmingBlackListPerLocale) {
      const blacks = stemmingBlackListPerLocale[locale].map(black =>
        black.normalize(txt => this.normalizeWord(locale, txt))
      );
      this.stemmingBlackListPerLocale[locale] = blacks;
    }

    for (const locale in stopWordsPerLocale) {
      this.stopWordsPerLocale[locale] = stopWordsPerLocale[locale].map(sw =>
        this.normalizeWord(locale, sw)
      );
    }
  }

  normalize(locale: Locale, txt: string): NormalizedUtterance {
    txt = txt.toLowerCase();
    txt = txt.replace(this.separatorsRegex, ' ');
    const stemmer = stemmerFor(locale);
    // tokenizer will replace i18n characters
    const tokens = this.tokenizer(locale).tokenize(txt, true);
    let stems: string[] = [];
    const stopWords = this.stopWordsPerLocale[locale];
    for (const token of tokens) {
      const black = this.getBlackListStem(locale, token);
      if (black) {
        stems.push(black);
        continue;
      }
      if (stopWords.includes(token)) {
        continue;
      }
      const tokenStems = stemmer.tokenizeAndStem(token, true);
      stems = stems.concat(...tokenStems);
    }
    if (stems.length == 0) {
      // console.log(`'${txt}' only contains stopwords. Not removing them`);
      return new NormalizedUtterance(txt, tokens, tokens, true);
    }
    return new NormalizedUtterance(txt, tokens, stems, false);
  }

  private normalizeWord(locale: Locale, stopWord: string): string {
    return this.tokenizer(locale)
      .tokenize(stopWord.toLowerCase(), true)
      .join(' ');
  }

  private getBlackListStem(locale: Locale, word: string): string | undefined {
    const blacks = this.stemmingBlackListPerLocale[locale] || [];
    for (const black of blacks) {
      if (black.isBlackListed(word)) {
        return black.stem;
      }
    }
    return undefined;
  }
}
