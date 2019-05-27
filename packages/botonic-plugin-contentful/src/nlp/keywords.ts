import { tokenizeAndStem } from './node-nlp';
import { substringIsBlankSeparated } from './tokens';

class CandidateWithKeywords<M> {
  constructor(readonly owner: M, readonly keywords: string[]) {}
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[];

  addCandidate(candidate: M, keywords: string[]): void {
    keywords = keywords.map(kw => {
      return tokenizeAndStem(kw).join(' ');
    });
    this.candidates.push(new CandidateWithKeywords(candidate, keywords));
  }

  findCandidatesWithKeywordsAt(tokens: string[]): M[] {
    let matches = [] as M[];
    for (let candidate of this.candidates) {
      for (let keyword of candidate.keywords) {
        if (substringIsBlankSeparated(tokens.join(' '), keyword)) {
          matches = matches.concat(candidate.owner);
          break;
        }
      }
    }
    return matches;
  }
}
