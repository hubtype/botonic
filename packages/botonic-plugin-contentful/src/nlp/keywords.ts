import { Locale } from './index';
import { tokenizeAndStem } from './node-nlp';
import { SimilarWordFinder } from './similar-words';

export class CandidateWithKeywords<M> {
  constructor(readonly owner: M, readonly keywords: string[]) {}
}

export enum MatchType {
  /** After removing stop words, spaces and word endings, the input text must only contain the keywords*/
  ONLY_KEYWORDS_FOUND,
  /** The keyword may be preceded and followed by other words */
  KEYWORDS_AND_OTHERS_FOUND,
  /** All the words in the keyword must appear on input text, even if mixed up with other words*/
  ALL_WORDS_IN_KEYWORDS_MIXED_UP
}

export const MATCH_TYPES = Object.values(MatchType).map(m => m as MatchType);

export class KeywordsOptions {
  constructor(readonly maxDistance = 0) {}
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[];
  private readonly similar = new SimilarWordFinder<M>(true);

  constructor(
    readonly locale: Locale,
    readonly matchType: MatchType,
    readonly options = new KeywordsOptions()
  ) {}

  /**
   *
   * @param candidate
   * @param rawKeywords a candidate may be associated to multiple keywords, and each one of them may contain multiple
   * words (which must appear together in the same order). The keywords will be stemmed.
   */
  addCandidate(candidate: M, rawKeywords: string[]): void {
    const stemmedKeywords = rawKeywords.map(kw => {
      return tokenizeAndStem(this.locale, kw).join(' ');
    });
    const candidateWithK = new CandidateWithKeywords(
      candidate,
      stemmedKeywords
    );
    this.candidates.push(candidateWithK);
    this.similar.addCandidate(candidateWithK);
  }

  findCandidatesWithKeywordsAt(stemmedTokens: string[]): M[] {
    const joinedTokens = stemmedTokens.join(' ');
    switch (this.matchType) {
      case MatchType.ONLY_KEYWORDS_FOUND: {
        const results = this.similar.findSimilarKeyword(joinedTokens);
        return results.map(swr => swr.candidate.owner);
      }
      case MatchType.KEYWORDS_AND_OTHERS_FOUND: {
        const results = this.similar.findSubstring(
          joinedTokens,
          this.options.maxDistance
        );
        return results.map(swr => swr.candidate.owner);
      }
      case MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP: {
        if (this.options.maxDistance > 0) {
          throw new Error(
            'ALL_WORDS_IN_KEYWORDS_MIXED_UP does not support distance> 0'
          );
        }
        const matches = [];
        for (const candidate of this.candidates) {
          for (const keyword of candidate.keywords) {
            if (this.containsAllWordsInKeyword(joinedTokens, keyword)) {
              matches.push(candidate.owner);
              break;
            }
          }
        }
        return matches;
      }
    }
  }

  private containsAllWordsInKeyword(
    joinedTokens: string,
    keyword: string
  ): boolean {
    for (const word of keyword.split(' ')) {
      if (!joinedTokens.includes(word)) {
        return false;
      }
    }
    return true;
  }
}
