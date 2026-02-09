import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtBotActionNode extends HtBaseNode {
  id: string
  type: HtNodeWithContentType.BOT_ACTION
  content: {
    payload_id: string
    payload_params?: string
  }
}
