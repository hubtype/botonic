import { HtBaseNode } from './common'
import { HtFunctionResult } from './function'
import { HtNodeWithContentType } from './node-types'

export interface HtChannelConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'get-channel-type'
    result_mapping: HtFunctionResult[]
  }
}
