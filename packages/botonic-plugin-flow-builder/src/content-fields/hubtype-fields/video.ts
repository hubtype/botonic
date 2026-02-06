import type { HtBaseNode, HtVideoLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtVideoNode extends HtBaseNode {
  type: HtNodeWithContentType.VIDEO
  content: {
    video: HtVideoLocale[]
  }
}
