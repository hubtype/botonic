import type { HtBaseNode } from './common'
import type { HtFunctionResult } from './function'
import type { HtNodeWithContentType } from './node-types'

export interface HtChannelConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'get-channel-type'
    result_mapping: HtFunctionResult[]
  }
}
