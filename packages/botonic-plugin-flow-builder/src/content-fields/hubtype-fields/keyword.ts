import type { HtBaseNode, HtInputLocale, HtTextLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtKeywordNode extends HtBaseNode {
  type: HtNodeWithContentType.KEYWORD
  content: {
    title: HtTextLocale[]
    keywords: HtInputLocale[]
  }
}
