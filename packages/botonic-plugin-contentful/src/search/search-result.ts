import {
  Button,
  Callback,
  ContentCallback,
  ModelType,
  PRIORITY_MAX,
  SCORE_MAX
} from '../cms';

export class SearchResult {
  static CHITCHAT_SHORT_TEXT = 'chitchat';

  /**
   * @param callback It may be a {@link Callback}'s with an URL instead of payload
   * @param match part of the input which match against a recognized text
   * TODO group args about content & args about match separately. make match compulsory
   */
  constructor(
    readonly callback: Callback,
    readonly name: string,
    readonly shortText?: string,
    readonly keywords: string[] = [],
    readonly priority = PRIORITY_MAX,
    readonly score = SCORE_MAX,
    readonly match?: string
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
    if (
      this.shortText !== SearchResult.CHITCHAT_SHORT_TEXT &&
      this.callback.model !== ModelType.CHITCHAT
    ) {
      return undefined;
    }
    return this.callback;
  }
}
