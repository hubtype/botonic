import { SimilarSearch } from 'node-nlp/lib/util';
import { CandidateWithKeywords } from './keywords';
import { countOccurrences } from './tokens';

export class SimilarWordResult<M> {
  constructor(
    readonly candidate: M,
    readonly match: string,
    readonly distance: number
  ) {}
}

const TOO_DISTANT = -1;

/**
 * It does not normalize case, ie. uppercase will be considered different than lowercase
 */
export class SimilarWordFinder<M> {
  private readonly similar = new SimilarSearch({ normalize: false });
  private readonly candidates: CandidateWithKeywords<M>[] = [];
  private readonly stemmedDecorator: StemmedExtraDistance;
  /**
   * @param wordsAreStemmed see {@link StemmedExtraDistance}
   * @param minWordLength below this length the words (or stems) must be identical
   */
  constructor(wordsAreStemmed: boolean, readonly minWordLength = 3) {
    this.stemmedDecorator = new StemmedExtraDistance(wordsAreStemmed);
  }
  /**
   *
   * @param candidate may contain several words (eg. "buenos días")
   */
  addCandidate(candidate: CandidateWithKeywords<M>): void {
    this.candidates.push(candidate);
  }

  findSimilarKeyword(
    sentence: string,
    maxDistance: number
  ): SimilarWordResult<M>[] {
    const results = [];
    for (const candidate of this.candidates) {
      for (const keyword of candidate.keywords) {
        const distance = this.getDistance(sentence, keyword, maxDistance);
        if (distance != TOO_DISTANT) {
          results.push(
            new SimilarWordResult<M>(candidate.owner, sentence, distance)
          );
        }
      }
    }

    return this.getLongestResultPerCandidate(results);
  }

  getDistance(sentence: string, keyword: string, maxDistance: number): number {
    if (sentence.length < this.minWordLength) {
      return sentence == keyword ? 0 : TOO_DISTANT;
    }

    const distance = this.similar.getSimilarity(sentence, keyword);
    if (distance > maxDistance + this.stemmedDecorator.extraDistance(keyword)) {
      return TOO_DISTANT;
    }
    if (
      distance > maxDistance &&
      !this.stemmedDecorator.verify(sentence, keyword)
    ) {
      return TOO_DISTANT;
    }
    return distance;
  }

  private getLongestResultPerCandidate(
    results: SimilarWordResult<M>[]
  ): SimilarWordResult<M>[] {
    const sorted = results.sort(
      (a: SimilarWordResult<M>, b: SimilarWordResult<M>) =>
        a.match.length - b.match.length
    );
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

  findSubstring(sentence: string, maxDistance = 1): SimilarWordResult<M>[] {
    const results: SimilarWordResult<M>[] = [];
    const wordPositions = this.similar.getWordPositions(sentence);
    for (const candidate of this.candidates) {
      for (const keyword of candidate.keywords) {
        if (keyword.length < this.minWordLength) {
          if (new RegExp(`\\b${keyword}\\b`).test(sentence)) {
            results.push(new SimilarWordResult<M>(candidate.owner, keyword, 0));
          }
          continue;
        }
        const extra = this.stemmedDecorator.extraDistance(keyword);
        const minAccuracy =
          (keyword.length - (maxDistance + extra)) / keyword.length;
        const substrings = this.similar.getBestSubstringList(
          sentence,
          keyword,
          wordPositions,
          minAccuracy
        );
        if (substrings.length > 0) {
          const bestSubstr = substrings.sort(
            (s1, s2) => s2.accuracy - s1.accuracy
          )[0];
          const match = sentence.slice(bestSubstr.start, bestSubstr.end + 1);
          const distance =
            keyword.length - bestSubstr.accuracy * keyword.length;
          if (
            distance <= maxDistance ||
            this.stemmedDecorator.verify(match, keyword)
          ) {
            results.push(
              new SimilarWordResult<M>(candidate.owner, match, distance)
            );
          }
        }
      }
    }

    return this.getLongestResultPerCandidate(results);
  }

  //TODO
  // findSubstringKeywordMixedUp(sentence: string, maxDistance = 1): SimilarWordResult<M>[] {
}

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

  verify(sentence: string, keyword: string): boolean {
    if (!this.wordsAreStemmed) {
      return true;
    }
    const words = keyword.split(' ');
    for (const word of words) {
      if (!sentence.includes(word)) {
        return false;
      }
    }
    return true;
  }
}
