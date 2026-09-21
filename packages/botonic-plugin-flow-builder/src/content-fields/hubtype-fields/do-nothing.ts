import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtDoNothingNode extends HtBaseNode {
  id: string
  type: HtNodeWithContentType.DO_NOTHING
}
