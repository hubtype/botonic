import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtContactReasonBranch {
  id: string
  name: string
  project_id: string
  project_name?: string
  target?: HtNodeLink
}

export interface HtContactReasonsNode extends HtBaseNode {
  type: HtNodeWithContentType.CONTACT_REASONS_CONDITION
  content: {
    contact_reasons: HtContactReasonBranch[]
    default_target?: HtNodeLink
    discarded_target?: HtNodeLink
    discarded_by_user_target?: HtNodeLink
    discarded_by_system_target?: HtNodeLink
  }
}
