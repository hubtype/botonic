import {
  Button,
  CommonFields,
  TopContentId,
  PRIORITY_MAX,
  SCORE_MAX,
  ContentCallback,
} from '../cms'
import { ContentType } from '../cms/cms'

export class SearchResult {
  static CHITCHAT_SHORT_TEXT = 'chitchat'

  /**
   * @param contentId It may be a {@link Callback}'s with an URL instead of payload
   * @param match part of the input which match against a recognized text
   * TODO group args about content & args about match separately. make match compulsory
   */
  constructor(
    readonly contentId: TopContentId,
    readonly common: CommonFields,
    readonly priority = PRIORITY_MAX,
    readonly score = SCORE_MAX,
    readonly match?: string
  ) {}

  toButton(): Button {
    let shortText = this.common.shortText
    if (!shortText) {
      shortText = this.common.name
      console.error(
        `${JSON.stringify(this.contentId)} ${
          this.common.name
        } without shortText. Assigning name to button text`
      )
    }
    return new Button(
      this.common.name,
      this.common.name,
      shortText,
      ContentCallback.ofContentId(this.contentId)
    )
  }

  getCallbackIfChitchat(): TopContentId | undefined {
    if (
      this.common.shortText !== SearchResult.CHITCHAT_SHORT_TEXT &&
      this.contentId.model !== ContentType.CHITCHAT
    ) {
      return undefined
    }
    return this.contentId
  }
}
