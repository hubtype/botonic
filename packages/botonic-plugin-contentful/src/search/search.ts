import {
  Button,
  Callback,
  CMS,
  ContentType,
  Context,
  ContextWithLocale,
  Text,
} from '../cms'
import { checkLocale, KeywordsOptions, MatchType, Normalizer } from '../nlp'
import { SearchByKeywords } from './search-by-keywords'
import { SearchResult } from './search-result'
// import { Profile } from '../util/profiler'

export class Search {
  private readonly search: SearchByKeywords
  constructor(
    private readonly cms: CMS,
    private readonly normalizer: Normalizer,
    keywordsOptions?: { [locale: string]: KeywordsOptions }
  ) {
    this.search = new SearchByKeywords(cms, normalizer, keywordsOptions)
  }

  /**
   * It does not sort the results based on the {@link SearchResult.priority}.
   * @param context must contain language
   */
  async searchByKeywords(
    inputText: string,
    matchType: MatchType,
    context: ContextWithLocale
  ): Promise<SearchResult[]> {
    const locale = checkLocale(context.locale)
    const utterance = this.normalizer.normalize(locale, inputText)
    const results = await this.search.searchContentsFromInput(
      utterance,
      matchType,
      context
    )
    return this.search.filterChitchat(utterance.words, results)
  }

  async respondFoundContents(
    results: SearchResult[],
    confirmKeywordsFoundTextId: string,
    noKeywordsFoundTextId: string,
    context: Context
  ): Promise<Text> {
    if (results.length == 0) {
      return this.cms.text(noKeywordsFoundTextId, context)
    }
    const chitchatCallback = results[0].getCallbackIfChitchat()
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id, context)
    }
    const buttonPromises = results.map(async result => {
      if (result.contentId.model == ContentType.URL) {
        const url = await this.cms.url(result.contentId.id, context)
        return new Button(
          result.common.id,
          result.common.name,
          result.common.shortText,
          Callback.ofUrl(url.url)
        )
      }
      return result.toButton()
    })
    const buttons = await Promise.all(buttonPromises)
    const text = await this.cms.text(confirmKeywordsFoundTextId, context)
    return text.cloneWithButtons(buttons)
  }
}
