import { HtBaseNode, HtVideoLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtVideoNode extends HtBaseNode {
  type: HtNodeWithContentType.VIDEO
  content: {
    video: HtVideoLocale[]
  }
}
