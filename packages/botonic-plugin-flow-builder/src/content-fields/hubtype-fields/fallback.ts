import { HtBaseNode, HtNodeLink } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtFallbackNode extends HtBaseNode {
  type: HtNodeWithContentType.FALLBACK
  content: {
    first_message?: HtNodeLink
    second_message?: HtNodeLink
  }
}
