import * as cms from '../cms';
import {
  KeywordsOptions,
  KeywordsParser,
  MatchType,
  checkLocale,
  Normalizer,
  NormalizedUtterance
} from '../nlp';
import { SearchResult } from './search-result';

export class SearchByKeywords {
  constructor(
    readonly cms: cms.CMS,
    readonly normalizer: Normalizer,
    readonly keywordsOptions: { [locale: string]: KeywordsOptions } = {}
  ) {}

  async searchContentsFromInput(
    inputText: NormalizedUtterance,
    matchType: MatchType,
    context: cms.Context
  ): Promise<SearchResult[]> {
    const locale = checkLocale(context.locale);
    const contentsWithKeywords = await this.cms.contentsWithKeywords(context);
    const kws = new KeywordsParser<SearchResult>(
      locale,
      matchType,
      this.normalizer,
      this.keywordsOptions[locale] || new KeywordsOptions()
    );
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.keywords!)
    );
    const results = kws.findCandidatesWithKeywordsAt(inputText);
    return results.map(res => {
      const candidate = res.candidate as SearchResult;
      // @ts-ignore
      candidate.match = res.match;
      return candidate;
    });
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

    const chitchats = callbacks.filter(isChitChat);
    if (chitchats.length == 0) {
      return callbacks;
    }
    if (chitchats.length < callbacks.length) {
      const noChitchats = callbacks.filter(c => !isChitChat(c));
      if (chitchats[0].match!.length - noChitchats[0].match!.length < 2) {
        return noChitchats;
      }
    }
    // all are chitchats
    const estimatedNoChitchatWords = tokens.length - chitchats.length * 2;
    if (estimatedNoChitchatWords > 2) {
      // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
      return [];
    }
    return [chitchats[0]];
  }
}
