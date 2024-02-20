import { Locale } from './locales'
import { NormalizedUtterance, Normalizer, Word } from './normalizer'
import { SimilarWordFinder, SimilarWordResult } from './similar-words'

/**
 * May contain multiple words
 * TODO consider storing as a list of new Token class instances', each with a raw and stem fields
 */
export class Keyword {
  /** Lowercase raw keyword */
  readonly raw: string
  /**
   * If hasOnlyStopWords == false, the stems of the non stopWords (eg. buy a shirt => buy shirt)
   * Otherwise, it contains the tokens of the stopwords (how are you => how are you)
   */
  readonly matchString: string

  constructor(
    raw: string,
    readonly words: Word[],
    readonly hasOnlyStopWords: boolean
  ) {
    if (hasOnlyStopWords) {
      this.matchString = Word.joinedTokens(words, true)
    } else {
      this.matchString = words
        .filter(w => !w.isStopWord)
        .map(w => w.stem)
        .join(' ')
    }
    this.raw = raw.trim().toLowerCase()
  }

  static fromUtterance(
    rawKeyword: string,
    locale: Locale,
    normalizer: Normalizer
  ): Keyword {
    const normalized = normalizer.normalize(locale, rawKeyword)
    return new Keyword(
      rawKeyword,
      normalized.words,
      normalized.hasOnlyStopWords()
    )
  }

  splitInWords(): Keyword[] {
    if (this.words.length == 1) {
      return [this]
    }
    return this.words.map(w => new Keyword(w.token, [w], w.isStopWord))
  }

  joinedTokens(withStopWords: boolean): string {
    return Word.joinedTokens(this.words, withStopWords)
  }
}

export class CandidateWithKeywords<M> {
  constructor(
    readonly owner: M,
    readonly keywords: Keyword[]
  ) {}
}

export enum MatchType {
  /** After removing stop words, spaces and word endings, the input text must only contain the keywords*/
  ONLY_KEYWORDS_FOUND,
  /** The keyword may be preceded and followed by other words */
  KEYWORDS_AND_OTHERS_FOUND,
  /** All the words in the keyword must appear on input text, even if mixed up with other words*/
  ALL_WORDS_IN_KEYWORDS_MIXED_UP,
}

export const MATCH_TYPES = Object.values(MatchType).map(m => m as MatchType)

export enum SortType {
  NONE,
  LENGTH,
}

export class KeywordsOptions {
  constructor(
    readonly maxDistance = 1,
    readonly similarWordsMinMatchLength = 3,
    readonly resultsSortType = SortType.LENGTH
  ) {}
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[]
  private readonly similar: SimilarWordFinder<M>

  constructor(
    readonly locale: Locale,
    readonly matchType: MatchType,
    readonly normalizer: Normalizer,
    readonly options: KeywordsOptions
  ) {
    this.similar = new SimilarWordFinder<M>(
      true,
      options.similarWordsMinMatchLength
    )
  }

  /**
   *
   * @param candidate
   * @param rawKeywords a candidate may be associated to multiple keywords, and each one of them may contain multiple
   * words (which must appear together in the same order). The keywords will be stemmed.
   * @throws EmptyTextException
   */
  addCandidate(candidate: M, rawKeywords: string[]): void {
    const stemmedKeywords = rawKeywords.map(rawKeyword => {
      return Keyword.fromUtterance(rawKeyword, this.locale, this.normalizer)
    })
    const candidateWithK = new CandidateWithKeywords(candidate, stemmedKeywords)
    this.candidates.push(candidateWithK)
    this.similar.addCandidate(candidateWithK)
  }

  findCandidatesWithKeywordsAt(
    utterance: NormalizedUtterance
  ): SimilarWordResult<M>[] {
    const results: SimilarWordResult<M>[] = this.similar.find(
      this.matchType,
      utterance,
      this.options.maxDistance
    )
    return this.sort(results)
  }

  private sort(results: SimilarWordResult<M>[]) {
    if (this.options.resultsSortType === SortType.NONE) {
      return results
    }
    return results.sort((r1, r2) => r2.match.length - r1.match.length)
  }
}
