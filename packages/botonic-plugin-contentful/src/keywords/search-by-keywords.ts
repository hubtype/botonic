import { tokenizeAndStem } from '../nlp';
import * as cms from '../cms';
import { KeywordsParser, MatchType } from '../nlp/keywords';

export class SearchByKeywords {
  constructor(readonly cms: cms.CMS, readonly matchType: MatchType) {}

  tokenize(inputText: string): string[] {
    return tokenizeAndStem(inputText);
  }

  async searchContentsFromInput(
    tokens: string[]
  ): Promise<cms.CallbackToContentWithKeywords[]> {
    let contentsWithKeywords = await this.cms.contentsWithKeywords();
    let kws = new KeywordsParser<cms.CallbackToContentWithKeywords>(
      this.matchType
    );
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.content.keywords!)
    );
    return kws.findCandidatesWithKeywordsAt(tokens);
  }

  /**
   * Chitchat contents need special treatment: does not make sense to ask user to disambiguate,
   * have less priority than non-chitchat contents,...
   * @return which contents must be displayed
   */
  public filterChitchat(
    tokens: string[],
    callbacks: cms.CallbackToContentWithKeywords[]
  ): cms.CallbackToContentWithKeywords[] {
    const isChitChat = (cc: cms.CallbackToContentWithKeywords) =>
      cc.getCallbackIfChitchat();

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
