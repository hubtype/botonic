import { normalize } from './node-nlp';
import { substringIsBlankSeparated } from './tokens';

class CandidateWithKeywords<M> {
  constructor(readonly owner: M, readonly keywords: string[]) {}
}

export class KeywordsParser<M> {
  private readonly candidates = [] as CandidateWithKeywords<M>[];

  addCandidate(candidate: M, keywords: string[]): void {
    keywords = keywords.map(kw => {
      return normalize(kw).join(' ');
    });
    this.candidates.push(new CandidateWithKeywords(candidate, keywords));
  }

  findCandidatesWithKeywordsAt(inputText: string): M[] {
    inputText = normalize(inputText).join(' ');
    let matches = [] as M[];
    for (let candidate of this.candidates) {
      for (let keyword of candidate.keywords) {
        if (substringIsBlankSeparated(inputText, keyword)) {
          matches = matches.concat(candidate.owner);
          break;
        }
      }
    }
    return matches;
  }
}
