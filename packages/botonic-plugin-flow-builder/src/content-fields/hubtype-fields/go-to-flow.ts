import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtGoToFlow extends HtBaseNode {
  id: string
  type: HtNodeWithContentType.GO_TO_FLOW
  content: {
    flow_id: string
  }
}
