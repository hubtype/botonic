import {
  Button,
  CommonFields,
  TopContentId,
  PRIORITY_MAX,
  ContentCallback,
} from '../cms'
import { ContentType } from '../cms/cms'

export class SearchCandidate {
  /**
   * @param contentId It may be a {@link Callback}'s with an URL instead of payload
   */
  constructor(
    readonly contentId: TopContentId,
    readonly common: CommonFields,
    readonly priority = PRIORITY_MAX
  ) {}

  withResult(match: string, score: number): SearchResult {
    return new SearchResult(this, match, score)
  }
}

export class SearchResult extends SearchCandidate {
  static CHITCHAT_SHORT_TEXT = 'chitchat'

  /**
   * @param match part of the input which match against a recognized text
   */
  constructor(
    candidate: SearchCandidate,
    readonly match: string,
    readonly score: number
  ) {
    super(candidate.contentId, candidate.common, candidate.priority)
  }

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
