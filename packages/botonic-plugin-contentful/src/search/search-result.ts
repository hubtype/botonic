import { Button, Callback, ContentCallback, ModelType } from '../cms';

export class SearchResult {
  static CHITCHAT_SHORT_TEXT = 'chitchat';

  constructor(
    /**
     * It may be a {@link Callback}'s with an URL instead of payload
     */
    readonly callback: Callback,
    readonly name: string,
    readonly shortText?: string,
    readonly keywords?: string[]
  ) {}

  toButton(): Button {
    let shortText = this.shortText;
    if (!shortText) {
      shortText = this.name;
      console.error(
        `${JSON.stringify(this.callback)} ${
          this.name
        } without shortText. Assigning name to button text`
      );
    }
    return new Button(this.name, shortText, this.callback);
  }

  getCallbackIfContentIs(modelType: ModelType): ContentCallback | undefined {
    if (
      this.callback instanceof ContentCallback &&
      this.callback.model === modelType
    ) {
      return this.callback;
    }
    return undefined;
  }

  getCallbackIfChitchat(): ContentCallback | undefined {
    if (!(this.callback instanceof ContentCallback)) {
      return undefined;
    }
    if (this.shortText !== SearchResult.CHITCHAT_SHORT_TEXT) {
      return undefined;
    }
    return this.callback;
  }
}
