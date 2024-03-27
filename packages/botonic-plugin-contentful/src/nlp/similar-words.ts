import { BestSubstringResult, ExtractorEnum } from '@nlpjs/ner/src'
import { leven } from '@nlpjs/similarity/src'

import { CandidateWithKeywords, Keyword, MatchType } from './keywords'
import { NormalizedUtterance, Word } from './normalizer'
import { countOccurrences } from './tokens'

export const enum WordSimilarityAlgorithm {
  LEVENSHTEIN,
}

export class WordsDistance {
  constructor(readonly algorithm = WordSimilarityAlgorithm.LEVENSHTEIN) {}
  distance(left: string, right: string): number {
    return leven(left, right)
  }
}

export class SimilarWordResult<M> {
  constructor(
    readonly candidate: M,
    readonly keyword: Keyword,
    readonly match: string,
    readonly distance: number
  ) {}

  /**
   *
   * @return < 0 if this is better than other
   */
  compare(other: SimilarWordResult<M>): number {
    if (this.distance == other.distance) {
      return other.match.length - this.match.length
    }
    return this.distance - other.distance
  }
}

class PartialMatch {
  constructor(
    readonly keyword: Keyword,
    readonly match: string,
    readonly distance: number
  ) {}
}
const TOO_DISTANT = -1

/**
 * It does not normalize case, ie. uppercase will be considered different than lowercase
 */
export class SimilarWordFinder<M> {
  private readonly candidates: CandidateWithKeywords<M>[] = []

  /**
   * @param wordsAreStemmed see {@link StemmedExtraDistance}
   * @param minMatchLength min number of characters that must match so that we tolerate non-identical matches
   */
  constructor(
    readonly wordsAreStemmed: boolean,
    readonly minMatchLength = 3
  ) {}

  /**
   *
   * @param candidate may contain several words (eg. "buenos días")
   */
  addCandidate(candidate: CandidateWithKeywords<M>): void {
    this.candidates.push(candidate)
  }

  private createFinder(matchType: MatchType) {
    switch (matchType) {
      case MatchType.ONLY_KEYWORDS_FOUND:
        return new FindIfOnlyWordsFromKeyword(
          this.wordsAreStemmed,
          this.minMatchLength
        )
      case MatchType.KEYWORDS_AND_OTHERS_FOUND:
        return new FindSubstring(this.wordsAreStemmed, this.minMatchLength)
      case MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP:
        return new FindMixedUp(this.wordsAreStemmed, this.minMatchLength)
      default:
        throw new Error(`Unexpected matchType ${String(matchType)}`)
    }
  }

  find(
    matchType: MatchType,
    utterance: NormalizedUtterance,
    maxDistance: number
  ) {
    const finder = this.createFinder(matchType)
    const results: SimilarWordResult<M>[] = []
    for (const candidate of this.candidates) {
      const matches = finder
        .find(candidate.keywords, utterance, maxDistance)
        .map(
          m =>
            new SimilarWordResult(
              candidate.owner,
              m.keyword,
              m.match,
              m.distance
            )
        )
      results.push(...matches)
    }
    return this.getLongestResultPerCandidate(results)
  }

  private getLongestResultPerCandidate(
    results: SimilarWordResult<M>[]
  ): SimilarWordResult<M>[] {
    const sorted = results.sort((a, b) => a.compare(b))
    // avoid duplicates
    const uniq: SimilarWordResult<M>[] = []
    const findBefore = (needle: M, before: number) => {
      for (let prev = before - 1; prev >= 0; prev--) {
        if (sorted[prev].candidate === needle) {
          return true
        }
      }
      return false
    }
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!findBefore(sorted[i].candidate, i)) {
        uniq.push(sorted[i])
      }
    }
    return uniq
  }
}

abstract class CandidateFinder {
  protected readonly stemmedDecorator: StemmedExtraDistance
  protected readonly similar = new ExtractorEnum()

  constructor(
    readonly wordsAreStemmed: boolean,
    readonly minMatchLength = 3
  ) {
    this.stemmedDecorator = new StemmedExtraDistance(wordsAreStemmed)
  }

  abstract find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[]

  protected getDistanceCore(
    utterance: NormalizedUtterance,
    utteranceText: string,
    keyword: Keyword,
    maxDistance: number
  ): number {
    const kwMatchString = keyword.matchString
    if (utteranceText.length <= this.minMatchLength) {
      return utteranceText == kwMatchString ? 0 : TOO_DISTANT
    }

    const distance = leven(utteranceText, kwMatchString)
    if (
      distance >
      maxDistance + this.stemmedDecorator.extraDistance(kwMatchString)
    ) {
      return TOO_DISTANT
    }
    if (
      getMatchLength(utteranceText.length, kwMatchString.length, distance) <
      this.minMatchLength
    ) {
      return TOO_DISTANT
    }
    if (
      distance > maxDistance &&
      !this.stemmedDecorator.verify(utterance.raw, utteranceText, keyword)
    ) {
      return TOO_DISTANT
    }
    return distance
  }

  protected utteranceText(
    utterance: NormalizedUtterance,
    keyword: Keyword
  ): string {
    if (keyword.hasOnlyStopWords) {
      return utterance.raw
    }
    // If it was not stemmed (maybe because it was on a black list), we don't want to stem the matching utterance
    // in case it contains the full keyword but with a typo
    return keyword.raw == keyword.matchString
      ? Word.joinedTokens(utterance.words, false)
      : utterance.stems.join(' ')
  }
}

class FindIfOnlyWordsFromKeyword extends CandidateFinder {
  find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[] {
    return keywords
      .map(keyword => this.getDistance(utterance, keyword, maxDistance))
      .filter(match => match.distance != TOO_DISTANT)
  }

  protected getDistance(
    utterance: NormalizedUtterance,
    keyword: Keyword,
    maxDistance: number
  ): PartialMatch {
    const utteranceText = this.utteranceText(utterance, keyword)
    const stemmedDistance = this.getDistanceCore(
      utterance,
      utteranceText,
      keyword,
      maxDistance
    )
    const stemmedMatch = new PartialMatch(
      keyword,
      utteranceText,
      stemmedDistance
    )
    // give priority to unstemmed match because it will involve more matching character
    const tokensMatch = this.getTokensMatch(utterance, keyword, maxDistance)
    if (tokensMatch && tokensMatch.distance <= stemmedDistance) {
      return tokensMatch
    }
    return stemmedMatch
  }

  private getTokensMatch(
    utterance: NormalizedUtterance,
    keyword: Keyword,
    maxDistance: number
  ): PartialMatch | undefined {
    const withStopWords = keyword.hasOnlyStopWords
    const utteranceTokens = utterance.joinedTokens(withStopWords)
    const keywordTokens = keyword.joinedTokens(withStopWords)
    if (
      Math.abs(utteranceTokens.length - keywordTokens.length) <= maxDistance
    ) {
      const tokensDistance = leven(utteranceTokens, keywordTokens)
      return new PartialMatch(keyword, utteranceTokens, tokensDistance)
    }
    return undefined
  }
}

class FindSubstring extends CandidateFinder {
  find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[] {
    return keywords
      .map(keyword => this.findKeyword(keyword, utterance, maxDistance))
      .filter(m => !!m)
      .map(m => m!)
  }

  public findKeyword(
    keyword: Keyword,
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch | undefined {
    const utteranceText = this.utteranceText(utterance, keyword)
    const wordPositions = this.similar.getWordPositions(utteranceText)
    if (keyword.matchString.length < this.minMatchLength) {
      if (new RegExp(`\\b${keyword.matchString}\\b`).test(utteranceText)) {
        return new PartialMatch(keyword, keyword.matchString, 0)
      }
      return undefined
    }
    const extra = this.stemmedDecorator.extraDistance(keyword.matchString)
    const minAccuracy =
      (keyword.matchString.length - (maxDistance + extra)) /
      keyword.matchString.length
    let substrings = this.similar.getBestSubstringList(
      utteranceText,
      keyword.matchString,
      wordPositions,
      minAccuracy
    )
    substrings = substrings.filter(
      (bs: BestSubstringResult) =>
        getMatchLength(bs.len, keyword.matchString.length, bs.levenshtein) >=
        this.minMatchLength
    )
    if (substrings.length == 0) {
      return undefined
    }
    const bestSubstr = substrings.sort(
      (s1: BestSubstringResult, s2: BestSubstringResult) =>
        s2.accuracy - s1.accuracy
    )[0]
    const match = utteranceText.slice(bestSubstr.start, bestSubstr.end + 1)
    const distance =
      keyword.matchString.length -
      bestSubstr.accuracy * keyword.matchString.length
    if (
      distance > maxDistance &&
      !this.stemmedDecorator.verify(match, match, keyword)
    ) {
      return undefined
    }
    return new PartialMatch(keyword, match, distance)
  }
}

class FindMixedUp extends CandidateFinder {
  readonly substring: FindSubstring
  constructor(
    readonly wordsAreStemmed: boolean,
    readonly minMatchLength = 3
  ) {
    super(wordsAreStemmed, minMatchLength)
    this.substring = new FindSubstring(wordsAreStemmed, minMatchLength)
  }

  find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[] {
    const matches: PartialMatch[] = []
    for (const keyword of keywords) {
      let submatches: PartialMatch[] | undefined = []
      for (const subkw of keyword.splitInWords()) {
        const match = this.substring.findKeyword(subkw, utterance, maxDistance)
        if (!match) {
          submatches = undefined
          break
        }
        submatches.push(match)
      }
      // in case the space between the words in the keyword is missing
      if (
        (!submatches || submatches.length == 0) &&
        keyword.raw.includes(' ')
      ) {
        const wordsWithoutSpace = this.substring.findKeyword(
          keyword,
          utterance,
          maxDistance
        )
        if (wordsWithoutSpace) {
          submatches = []
          submatches.push(wordsWithoutSpace)
        }
      }
      if (submatches) {
        const match = submatches.reduce(
          (m1: PartialMatch, m2: PartialMatch) =>
            new PartialMatch(
              keyword,
              m1.match + (m1.match ? ' ' : '') + m2.match,
              m1.distance + m2.distance
            ),
          new PartialMatch(keyword, '', 0)
        )
        matches.push(match)
      }
    }
    return matches
  }
}

/**
 * When keywords contain multiple words and they're stemmed, allow extra distance
 * in case utterance missed a space eg 'goodmorning'
 */
class StemmedExtraDistance {
  constructor(readonly wordsAreStemmed: boolean) {}

  extraDistance(keyword: string): number {
    if (!this.wordsAreStemmed) {
      return 0
    }
    const wordsInKeyword = countOccurrences(keyword, ' ') + 1
    if (wordsInKeyword > 1 && keyword.length > 5) {
      // in case needle is missing a space, the first word could not be stemmed.
      // So we need to ignore the suffix
      return 3 * (wordsInKeyword - 1)
    }
    return 0
  }

  verify(
    utteranceRaw: string,
    utteranceNormalized: string,
    keyword: Keyword
  ): boolean {
    if (!this.wordsAreStemmed) {
      return true
    }
    const words = keyword.matchString.split(' ')
    for (const word of words) {
      // checking also raw because if utterance missing a space, maybe utterance
      // is more aggressively stemmed than the keyword
      if (!utteranceRaw.includes(word) && !utteranceNormalized.includes(word)) {
        return false
      }
    }
    return true
  }
}

export function getMatchLength(
  utteranceLen: number,
  keywordLen: number,
  distance: number
): number {
  const difLen = Math.abs(utteranceLen - keywordLen)
  return Math.min(utteranceLen, keywordLen) - distance + difLen
}
