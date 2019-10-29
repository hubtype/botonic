import { Button, Callback, CMS, ModelType, Text, Context } from '../cms'
import { KeywordsOptions, MatchType, Normalizer, checkLocale } from '../nlp'
import { SearchByKeywords } from './search-by-keywords'
import { SearchResult } from './search-result'

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
    context: Context
  ): Promise<SearchResult[]> {
    const locale = checkLocale(context.locale)
    const utterance = this.normalizer.normalize(locale, inputText)
    const contents = await this.search.searchContentsFromInput(
      utterance,
      matchType,
      context
    )
    return this.search.filterChitchat(utterance.stems, contents)
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
      const urlCallback = result.getCallbackIfContentIs(ModelType.URL)
      if (urlCallback) {
        const url = await this.cms.url(urlCallback.id, context)
        return new Button(
          result.common.name,
          result.common.shortText!,
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
