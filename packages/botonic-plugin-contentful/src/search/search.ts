import {
  Button,
  Callback,
  CallbackToContentWithKeywords,
  CMS,
  ModelType,
  Text
} from '../cms';
import { MatchType } from '../nlp/keywords';
import { SearchByKeywords } from './search-by-keywords';

export class Search {
  readonly search: SearchByKeywords;
  constructor(private readonly cms: CMS) {
    this.search = new SearchByKeywords(cms);
  }

  async searchByKeywords(
    inputText: string,
    matchType: MatchType
  ): Promise<CallbackToContentWithKeywords[]> {
    let tokens = this.search.tokenize(inputText);
    let contents = await this.search.searchContentsFromInput(tokens, matchType);
    return this.search.filterChitchat(tokens, contents);
  }

  async respondFoundContents(
    contents: CallbackToContentWithKeywords[],
    confirmKeywordsFoundTextId: string,
    noKeywordsFoundTextId: string
  ): Promise<Text> {
    if (contents.length == 0) {
      return this.cms.text(noKeywordsFoundTextId);
    }
    let chitchatCallback = contents[0].getCallbackIfChitchat();
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id);
    }
    let buttonPromises = contents.map(async contentCallback => {
      let urlCallback = contentCallback.getCallbackIfContentIs(ModelType.URL);
      if (urlCallback) {
        let url = await this.cms.url(urlCallback.id);
        return new Button(
          contentCallback.content.name,
          contentCallback.content.shortText!,
          Callback.ofUrl(url.url)
        );
      }
      return contentCallback.toButton();
    });
    let buttons = await Promise.all(buttonPromises);
    let text = await this.cms.text(confirmKeywordsFoundTextId);
    return text.cloneWithButtons(buttons);
  }
}

