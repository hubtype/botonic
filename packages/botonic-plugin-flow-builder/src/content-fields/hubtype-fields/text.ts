import { HtButton } from './button'
import { HtBaseNode, HtTextLocale } from './common'
import { HtButtonStyle, HtNodeWithContentType } from './node-types'

export interface HtTextNode extends HtBaseNode {
  type: HtNodeWithContentType.TEXT
  content: {
    text: HtTextLocale[]
    buttons_style?: HtButtonStyle
    buttons: HtButton[]
  }
}
