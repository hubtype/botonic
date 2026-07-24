import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

interface SmartIntent {
  title: string
  description: string
  is_active: boolean
}

export interface HtSmartIntentNode extends HtBaseNode {
  type: HtNodeWithContentType.SMART_INTENT
  content: SmartIntent
}
