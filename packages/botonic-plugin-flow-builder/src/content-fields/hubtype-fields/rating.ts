import { HtBaseNode, HtNodeLink, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export enum RatingType {
  Stars = 'stars',
  Smileys = 'smileys',
}

export interface HtRatingButton {
  id: string
  text: string
  payload: string
  value: number
  target?: HtNodeLink
}

export interface HtRatingNode extends HtBaseNode {
  type: HtNodeWithContentType.RATING
  content: {
    text: HtTextLocale[]
    buttons: HtRatingButton[]
    rating_type: RatingType
    send_button_text: HtTextLocale[]
    open_list_button_text: HtTextLocale[]
  }
}
