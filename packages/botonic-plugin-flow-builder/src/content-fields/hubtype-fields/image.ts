import type { HtBaseNode, HtMediaFileLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtImageNode extends HtBaseNode {
  type: HtNodeWithContentType.IMAGE
  content: {
    image: HtMediaFileLocale[]
  }
}
