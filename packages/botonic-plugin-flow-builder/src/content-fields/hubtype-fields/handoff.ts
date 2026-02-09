import type { HtBaseNode, HtPayloadLocale, HtQueueLocale } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtHandoffNode extends HtBaseNode {
  type: HtNodeWithContentType.HANDOFF
  content: {
    queue: HtQueueLocale[]
    payload: HtPayloadLocale[]
    has_auto_assign: boolean
    has_queue_position_changed_notifications_enabled: boolean
  }
}
