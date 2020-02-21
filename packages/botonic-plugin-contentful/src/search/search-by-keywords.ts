import * as cms from '../cms'
import {
  KeywordsOptions,
  KeywordsParser,
  MatchType,
  checkLocale,
  Normalizer,
  NormalizedUtterance,
  Word,
} from '../nlp'
import { SearchResult } from './search-result'

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
    const locale = checkLocale(context.locale)
    const contentsWithKeywords = await this.cms.contentsWithKeywords(context)
    const kws = new KeywordsParser<SearchResult>(
      locale,
      matchType,
      this.normalizer,
      this.keywordsOptions[locale] || new KeywordsOptions()
    )
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.common.keywords!)
    )
    const results = kws.findCandidatesWithKeywordsAt(inputText)
    return results.map(res => {
      const candidate = res.candidate as SearchResult
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      candidate.match = res.match
      return candidate
    })
  }

  /**
   * Chitchat contents need special treatment: does not make sense to ask user to disambiguate,
   * have less priority than non-chitchat contents,...
   * @return which contents must be displayed
   */
  public filterChitchat(
    words: Word[],
    results: SearchResult[]
  ): SearchResult[] {
    const isChitChat = (cc: SearchResult) => cc.getCallbackIfChitchat()

    const chitchats = results.filter(isChitChat)
    if (chitchats.length == 0) {
      return results
    }
    if (chitchats.length < results.length) {
      const noChitchats = results.filter(c => !isChitChat(c))
      if (chitchats[0].match!.length - noChitchats[0].match!.length < 2) {
        return noChitchats
      }
    }
    // all are chitchats
    const estimatedNoChitchatWords = words.length - chitchats.length * 2
    if (estimatedNoChitchatWords > 2) {
      // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
      return []
    }
    return [chitchats[0]]
  }
}
