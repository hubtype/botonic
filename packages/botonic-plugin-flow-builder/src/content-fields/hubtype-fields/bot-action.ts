import { HtBaseNode } from './common'
import { HtNodeWithoutContentType } from './node-types'

export interface HtBotActionNode extends HtBaseNode {
  id: string
  type: HtNodeWithoutContentType.BOT_ACTION
  content: {
    payload_id: string
    payload_params?: string
  }
}
