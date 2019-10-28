import { SimilarSearch, WordPosition } from 'node-nlp/lib/util';
import { CandidateWithKeywords, Keyword, MatchType } from './keywords';
import { countOccurrences } from './tokens';
import { NormalizedUtterance } from './normalizer';

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
      return other.match.length - this.match.length;
    }
    return this.distance - other.distance;
  }
}

class PartialMatch {
  constructor(
    readonly keyword: Keyword,
    readonly match: string,
    readonly distance: number
  ) {}
}
const TOO_DISTANT = -1;

/**
 * It does not normalize case, ie. uppercase will be considered different than lowercase
 */
export class SimilarWordFinder<M> {
  private readonly candidates: CandidateWithKeywords<M>[] = [];

  /**
   * @param wordsAreStemmed see {@link StemmedExtraDistance}
   * @param minWordLength below this length the words (or stems) must be identical
   */
  constructor(readonly wordsAreStemmed: boolean, readonly minWordLength = 3) {}

  /**
   *
   * @param candidate may contain several words (eg. "buenos días")
   */
  addCandidate(candidate: CandidateWithKeywords<M>): void {
    this.candidates.push(candidate);
  }

  private createFinder(matchType: MatchType) {
    switch (matchType) {
      case MatchType.ONLY_KEYWORDS_FOUND:
        return new FindIfOnlyWordsFromKeyword(
          this.wordsAreStemmed,
          this.minWordLength
        );
      case MatchType.KEYWORDS_AND_OTHERS_FOUND:
        return new FindSubstring(this.wordsAreStemmed, this.minWordLength);
      case MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP:
        return new FindMixedUp(this.wordsAreStemmed, this.minWordLength);
    }
    throw new Error(`Unexpected matchType ${matchType}`);
  }

  find(
    matchType: MatchType,
    utterance: NormalizedUtterance,
    maxDistance: number
  ) {
    const finder = this.createFinder(matchType);
    const results: SimilarWordResult<M>[] = [];
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
        );
      results.push(...matches);
    }
    return this.getLongestResultPerCandidate(results);
  }

  private getLongestResultPerCandidate(
    results: SimilarWordResult<M>[]
  ): SimilarWordResult<M>[] {
    const sorted = results.sort((a, b) => a.compare(b));
    // avoid duplicates
    const uniq = [];
    const findBefore = (needle: M, before: number) => {
      for (let prev = before - 1; prev >= 0; prev--) {
        if (sorted[prev].candidate === needle) {
          return true;
        }
      }
      return false;
    };
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!findBefore(sorted[i].candidate, i)) {
        uniq.push(sorted[i]);
      }
    }
    return uniq;
  }
}

abstract class CandidateFinder {
  protected readonly stemmedDecorator: StemmedExtraDistance;
  protected readonly similar = new SimilarSearch({ normalize: false });

  constructor(readonly wordsAreStemmed: boolean, readonly minWordLength = 3) {
    this.stemmedDecorator = new StemmedExtraDistance(wordsAreStemmed);
  }

  abstract find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[];

  protected getDistanceCore(
    utterance: string,
    keyword: string,
    maxDistance: number
  ): number {
    if (utterance.length < this.minWordLength) {
      return utterance == keyword ? 0 : TOO_DISTANT;
    }

    const distance = this.similar.getSimilarity(utterance, keyword);
    if (distance > maxDistance + this.stemmedDecorator.extraDistance(keyword)) {
      return TOO_DISTANT;
    }
    if (
      distance > maxDistance &&
      !this.stemmedDecorator.verify(utterance, keyword)
    ) {
      return TOO_DISTANT;
    }
    return distance;
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
      .filter(match => match.distance != TOO_DISTANT);
  }

  getDistance(
    text: NormalizedUtterance,
    keyword: Keyword,
    maxDistance: number
  ): PartialMatch {
    if (keyword.hasOnlyStopWords) {
      const re = this.getDistanceCore(text.raw, keyword.stemmed, maxDistance);
      return new PartialMatch(keyword, text.raw, re);
    }
    return new PartialMatch(
      keyword,
      text.joinedStems,
      this.getDistanceCore(text.joinedStems, keyword.stemmed, maxDistance)
    );
  }
}

class FindSubstring extends CandidateFinder {
  find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[] {
    // TODO catch utterance of pass n constructor
    const wordPositions = this.similar.getWordPositions(utterance.joinedStems);

    return keywords
      .map(keyword =>
        this.findKeyword(keyword, utterance, maxDistance, wordPositions)
      )
      .filter(m => !!m)
      .map(m => m!);
  }

  public findKeyword(
    keyword: Keyword,
    utterance: NormalizedUtterance,
    maxDistance: number,
    wordPositions: WordPosition[]
  ): PartialMatch | undefined {
    if (keyword.stemmed.length < this.minWordLength) {
      if (new RegExp(`\\b${keyword.stemmed}\\b`).test(utterance.joinedStems)) {
        return new PartialMatch(keyword, keyword.stemmed, 0);
      }
      return undefined;
    }
    const extra = this.stemmedDecorator.extraDistance(keyword.stemmed);
    const minAccuracy =
      (keyword.stemmed.length - (maxDistance + extra)) / keyword.stemmed.length;
    const substrings = this.similar.getBestSubstringList(
      utterance.joinedStems,
      keyword.stemmed,
      wordPositions,
      minAccuracy
    );
    if (substrings.length == 0) {
      return undefined;
    }
    const bestSubstr = substrings.sort(
      (s1, s2) => s2.accuracy - s1.accuracy
    )[0];
    const match = utterance.joinedStems.slice(
      bestSubstr.start,
      bestSubstr.end + 1
    );
    const distance =
      keyword.stemmed.length - bestSubstr.accuracy * keyword.stemmed.length;
    if (
      distance > maxDistance &&
      !this.stemmedDecorator.verify(match, keyword.stemmed)
    ) {
      return undefined;
    }
    return new PartialMatch(keyword, match, distance);
  }
}

class FindMixedUp extends CandidateFinder {
  readonly substring: FindSubstring;
  constructor(readonly wordsAreStemmed: boolean, readonly minWordLength = 3) {
    super(wordsAreStemmed, minWordLength);
    this.substring = new FindSubstring(wordsAreStemmed, minWordLength);
  }

  find(
    keywords: Keyword[],
    utterance: NormalizedUtterance,
    maxDistance: number
  ): PartialMatch[] {
    // TODO catch utterance of pass n constructor
    const wordPositions = this.similar.getWordPositions(utterance.joinedStems);
    const matches = [];
    for (const keyword of keywords) {
      let submatches: PartialMatch[] | undefined = [];
      for (const subkw of keyword.splitInWords()) {
        const match = this.substring.findKeyword(
          subkw,
          utterance,
          maxDistance,
          wordPositions
        );
        if (!match) {
          submatches = undefined;
          break;
        }
        submatches.push(match);
      }
      // in case the space between the words in the keyword is missing
      if (
        !submatches ||
        (submatches.length == 0 && keyword.raw.includes(' '))
      ) {
        const wordsWithoutSpace = this.substring.findKeyword(
          keyword,
          utterance,
          maxDistance,
          wordPositions
        );
        if (wordsWithoutSpace) {
          submatches = [];
          submatches.push(wordsWithoutSpace);
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
        );
        matches.push(match);
      }
    }
    return matches;
  }
}

/**
 * When keywords contain multiple words and they're stemmed, allow extra distance
 */
class StemmedExtraDistance {
  constructor(readonly wordsAreStemmed: boolean) {}

  extraDistance(keyword: string): number {
    if (!this.wordsAreStemmed) {
      return 0;
    }
    const wordsInKeyword = countOccurrences(keyword, ' ') + 1;
    if (wordsInKeyword > 1 && keyword.length > 5) {
      // in case needle is missing a space, the first word could not be stemmed.
      // So we need to ignore the suffix
      return 3 * (wordsInKeyword - 1);
    }
    return 0;
  }

  verify(utterance: string, keyword: string): boolean {
    if (!this.wordsAreStemmed) {
      return true;
    }
    const words = keyword.split(' ');
    for (const word of words) {
      if (!utterance.includes(word)) {
        return false;
      }
    }
    return true;
  }
}

export function getMatchLength(
  utterance: string,
  keyword: string,
  distance: number
): number {
  // if (utterance.length != keyword.length) {
  const difLen = Math.abs(utterance.length - keyword.length);
  //   if (difLen == distance) {
  // distance(abc,ab) = 1 => matchLen = 2
  return Math.min(utterance.length, keyword.length) - distance + difLen;
  // } else {
  //   // distance(abc,acbd) = 2 => matchLen 1
  //   return Math.min(utterance.length, keyword.length) - difLen;
  // }
  // }
}
