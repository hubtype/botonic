import { SimilarSearch } from 'node-nlp/lib/util';
import { CandidateWithKeywords } from './keywords';
import { countOccurrences } from './tokens';

export class SimilarWordResult<M> {
  constructor(
    readonly candidate: CandidateWithKeywords<M>,
    readonly distance: number
  ) {}
}

export class SimilarWordFinder<M> {
  private readonly similar = new SimilarSearch({ normalize: false });
  private readonly candidates: CandidateWithKeywords<M>[] = [];
  private readonly stemmedDecorator: StemmedExtraDistance;

  constructor(wordsAreStemmed: boolean) {
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
    maxDistance = 1
  ): SimilarWordResult<M>[] {
    const results = [];
    for (const candidate of this.candidates) {
      for (const keyword of candidate.keywords) {
        const distance = this.similar.getSimilarity(sentence, keyword);
        if (
          distance >
          maxDistance + this.stemmedDecorator.extraDistance(keyword)
        ) {
          continue;
        }
        if (
          distance <= maxDistance ||
          this.stemmedDecorator.verify(sentence, keyword)
        ) {
          results.push(new SimilarWordResult(candidate, distance));
        }
      }
    }

    return this.sortByDistance(results);
  }

  private sortByDistance(
    results: SimilarWordResult<M>[]
  ): SimilarWordResult<M>[] {
    const sorted = results.sort(
      (a: SimilarWordResult<M>, b: SimilarWordResult<M>) =>
        a.distance - b.distance
    );
    // avoid duplicates
    const uniq = [];
    const findBefore = (needle: M, before: number) => {
      for (let prev = before - 1; prev >= 0; prev--) {
        if (sorted[prev].candidate.owner === needle) {
          return true;
        }
      }
      return false;
    };
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!findBefore(sorted[i].candidate.owner, i)) {
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
          substrings.forEach(ss => console.log(sentence.slice(ss.start, ss.end+1), keyword));
          const distance =
            keyword.length - bestSubstr.accuracy * keyword.length;
          if (
            distance <= maxDistance ||
            this.stemmedDecorator.verify(
              sentence.slice(bestSubstr.start, bestSubstr.end + 1),
              keyword
            )
          ) {
            results.push(new SimilarWordResult<M>(candidate, distance));
          }
        }
      }
    }

    return this.sortByDistance(results);
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
        console.log(`not included ${word} in ${sentence}`);
        return false;
      }
    }
    return true;
  }
}
