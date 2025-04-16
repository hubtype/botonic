import { HtBaseNode, HtInputLocale, HtTextLocale } from './common'
import { HtNodeWithContentType } from './node-types'

// TODO: Remove this because frontend no allow create intents babel
export interface HtIntentNode extends HtBaseNode {
  type: HtNodeWithContentType.INTENT
  content: {
    title: HtTextLocale[]
    intents: HtInputLocale[]
    confidence: number
  }
}
