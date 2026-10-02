import type {
  HtBaseNode,
  HtNodeLink,
  HtPayloadLocale,
  HtQueueLocale,
} from './common'
import type { HtNodeWithContentType } from './node-types'

export enum DiscardType {
  ByAgent = 'discarded',
  ByUser = 'discarded_by_user',
  BySystem = 'discarded_by_system',
}

export interface HtHandoffNode extends HtBaseNode {
  type: HtNodeWithContentType.HANDOFF
  content: {
    queue: HtQueueLocale[]
    payload: HtPayloadLocale[]
    has_auto_assign: boolean
    has_queue_position_changed_notifications_enabled: boolean
    has_differentiated_close_types: boolean
    resolved_by_agent?: HtNodeLink
    discarded_by_agent?: HtNodeLink
    discarded_by_user?: HtNodeLink
    discarded_by_system?: HtNodeLink
  }
}
