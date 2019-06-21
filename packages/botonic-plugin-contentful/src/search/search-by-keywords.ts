import * as cms from '../cms';
import { tokenizeAndStem } from '../nlp';
import { KeywordsParser, MatchType } from '../nlp/keywords';
import { SearchResult } from './search-result';

export class SearchByKeywords {
  constructor(readonly cms: cms.CMS) {}

  tokenize(inputText: string): string[] {
    return tokenizeAndStem(inputText);
  }

  async searchContentsFromInput(
    inputTextTokens: string[],
    matchType: MatchType
  ): Promise<SearchResult[]> {
    let contentsWithKeywords = await this.cms.contentsWithKeywords();
    let kws = new KeywordsParser<SearchResult>(matchType);
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.keywords!)
    );
    return kws.findCandidatesWithKeywordsAt(inputTextTokens);
  }

  /**
   * Chitchat contents need special treatment: does not make sense to ask user to disambiguate,
   * have less priority than non-chitchat contents,...
   * @return which contents must be displayed
   */
  public filterChitchat(
    tokens: string[],
    callbacks: SearchResult[]
  ): SearchResult[] {
    const isChitChat = (cc: SearchResult) => cc.getCallbackIfChitchat();

    const chitchatContents = callbacks.filter(isChitChat);
    if (chitchatContents.length == 0) {
      return callbacks;
    }
    if (chitchatContents.length < callbacks.length) {
      return callbacks.filter(c => !isChitChat(c));
    }
    // all are chitchats
    const estimatedNoChitchatWords =
      tokens.length - chitchatContents.length * 2;
    if (estimatedNoChitchatWords > 2) {
      // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
      return [];
    }
    return [chitchatContents[0]];
  }
}
