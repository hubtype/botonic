import {
  Button,
  Callback,
  SearchResult,
  CMS,
  ModelType,
  Text,
  Context
} from '../cms';
import { MatchType } from '../nlp/keywords';
import { checkLocale } from '../nlp/locales';
import { SearchByKeywords } from './search-by-keywords';

export class Search {
  readonly search: SearchByKeywords;
  constructor(private readonly cms: CMS) {
    this.search = new SearchByKeywords(cms);
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
    let locale = checkLocale(context.locale);
    let tokens = this.search.tokenize(locale, inputText);
    let contents = await this.search.searchContentsFromInput(
      tokens,
      matchType,
      context
    );
    return this.search.filterChitchat(tokens, contents);
  }

  async respondFoundContents(
    results: SearchResult[],
    confirmKeywordsFoundTextId: string,
    noKeywordsFoundTextId: string
  ): Promise<Text> {
    if (results.length == 0) {
      return this.cms.text(noKeywordsFoundTextId);
    }
    let chitchatCallback = results[0].getCallbackIfChitchat();
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id);
    }
    let buttonPromises = results.map(async result => {
      let urlCallback = result.getCallbackIfContentIs(ModelType.URL);
      if (urlCallback) {
        let url = await this.cms.url(urlCallback.id);
        return new Button(
          result.name,
          result.shortText!,
          Callback.ofUrl(url.url)
        );
      }
      return result.toButton();
    });
    let buttons = await Promise.all(buttonPromises);
    let text = await this.cms.text(confirmKeywordsFoundTextId);
    return text.cloneWithButtons(buttons);
  }
}
