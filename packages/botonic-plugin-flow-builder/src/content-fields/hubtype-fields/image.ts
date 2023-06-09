import { HtBaseNode, HtMediaFileLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtImageNode extends HtBaseNode {
  type: HtNodeWithContentType.IMAGE
  content: {
    image: HtMediaFileLocale[]
  }
}
