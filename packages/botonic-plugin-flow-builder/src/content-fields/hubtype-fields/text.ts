import type { HtButton } from './button'
import type { HtBaseNode, HtTextLocale } from './common'
import type { HtButtonStyle, HtNodeWithContentType } from './node-types'

export interface HtTextNode extends HtBaseNode {
  type: HtNodeWithContentType.TEXT
  content: {
    text: HtTextLocale[]
    buttons_style?: HtButtonStyle
    buttons: HtButton[]
  }
}
