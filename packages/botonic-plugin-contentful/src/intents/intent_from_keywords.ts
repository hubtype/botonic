import { tokenizeAndStem } from '../nlp';
import * as cms from '../cms';
import { KeywordsParser } from '../nlp/keywords';

export class IntentPredictorFromKeywords {
  constructor(readonly cms: cms.CMS) {}

  tokenize(inputText: string): string[] {
    return tokenizeAndStem(inputText);
  }

  async suggestContentsFromInput(
    tokens: string[]
  ): Promise<cms.CallbackToContentWithKeywords[]> {
    let contentsWithKeywords = await this.cms.contentsWithKeywords();
    let kws = new KeywordsParser<cms.CallbackToContentWithKeywords>();
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.content.keywords!)
    );
    return kws.findCandidatesWithKeywordsAt(tokens);
  }

  /**
   * It decides how to react to a list of chitchat keywords and not chitchat keywords.
   * @return which contents must be displayed
   */
  public async filterChitchat(
    tokens: string[],
    callbacks: cms.CallbackToContentWithKeywords[]
  ): Promise<cms.CallbackToContentWithKeywords[]> {
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
