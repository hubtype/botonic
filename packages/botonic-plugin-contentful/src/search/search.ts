import {
  Button,
  Callback,
  SearchResult,
  CMS,
  ModelType,
  Text,
  DEFAULT_CONTEXT
} from '../cms';
import { MatchType } from '../nlp/keywords';
import { SearchByKeywords } from './search-by-keywords';

export class Search {
  readonly search: SearchByKeywords;
  constructor(private readonly cms: CMS) {
    this.search = new SearchByKeywords(cms);
  }

  /**
   * It does not sort the results based on the {@link SearchResult.priority}.
   */
  async searchByKeywords(
    inputText: string,
    matchType: MatchType,
    context = DEFAULT_CONTEXT
  ): Promise<SearchResult[]> {
    let tokens = this.search.tokenize(inputText);
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
