import * as cms from '../cms'
import {
  checkLocale,
  KeywordsOptions,
  KeywordsParser,
  languageFromLocale,
  MatchType,
  NormalizedUtterance,
  Normalizer,
  Word,
} from '../nlp'
import { SearchCandidate, SearchResult } from './search-result'

export class SearchByKeywords {
  constructor(
    readonly cms: cms.CMS,
    readonly normalizer: Normalizer,
    readonly keywordsOptions: { [locale: string]: KeywordsOptions } = {}
  ) {}

  /**
   * It will assign a score based on the ratio of the matched substring length wit respect to the input length
   */
  async searchContentsFromInput(
    inputText: NormalizedUtterance,
    matchType: MatchType,
    context: cms.ContextWithLocale
  ): Promise<SearchResult[]> {
    checkLocale(context.locale)
    const contentsWithKeywords = await this.cms.contentsWithKeywords(context)
    const options =
      this.keywordsOptions[context.locale] ||
      this.keywordsOptions[languageFromLocale(context.locale)] ||
      new KeywordsOptions()
    const kws = new KeywordsParser<SearchCandidate>(
      context.locale,
      matchType,
      this.normalizer,
      options
    )
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.common.keywords)
    )
    const results = kws.findCandidatesWithKeywordsAt(inputText)
    return results.map(res => {
      const score = res.match.length / inputText.raw.length
      return res.candidate.withResult(res.match, score)
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
