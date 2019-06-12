import { tokenizeAndStem } from './node-nlp';
import { substringIsBlankSeparated } from './tokens';

class CandidateWithKeywords<M> {
  constructor(readonly owner: M, readonly keywords: string[]) {}
}

export enum MatchType {
  /** After removing stop words, spaces and word endings, the input text must only contain the keywords*/
  ONLY_KEYWORDS_FOUND,
  /** The keyword may be preceded and followed by other words */
  KEYWORDS_AND_OTHERS_FOUND
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[];

  constructor(readonly matchType: MatchType) {}

  addCandidate(candidate: M, rawKeywords: string[]): void {
    let stemmedKeywords = rawKeywords.map(kw => {
      return tokenizeAndStem(kw).join(' ');
    });
    this.candidates.push(new CandidateWithKeywords(candidate, stemmedKeywords));
  }

  findCandidatesWithKeywordsAt(stemmedTokens: string[]): M[] {
    let matches = [] as M[];
    let joinedTokens = stemmedTokens.join(' ');
    for (let candidate of this.candidates) {
      for (let keyword of candidate.keywords) {
        if (this.keywordMatches(joinedTokens, keyword)) {
          matches = matches.concat(candidate.owner);
          break;
        }
      }
    }
    return matches;
  }

  private keywordMatches(joinedTokens: string, keyword: string): boolean {
    switch (this.matchType) {
      case MatchType.KEYWORDS_AND_OTHERS_FOUND:
        return substringIsBlankSeparated(joinedTokens, keyword);
      case MatchType.ONLY_KEYWORDS_FOUND:
        return joinedTokens == keyword;
    }
  }
}
