import { HtBaseNode, HtInputLocale, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtIntentNode extends HtBaseNode {
  type: HtNodeWithContentType.INTENT
  content: {
    title: HtTextLocale[]
    intents: HtInputLocale[]
    confidence: number
  }
}
