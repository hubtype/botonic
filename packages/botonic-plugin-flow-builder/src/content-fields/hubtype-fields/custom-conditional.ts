import type { HtBaseNode } from './common'
import type { HtFunctionArguments, HtFunctionResult } from './function'
import type { HtNodeWithContentType } from './node-types'

export interface HtCustomConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'check-bot-variable'
    arguments: HtFunctionArguments[]
    result_mapping: HtFunctionResult[]
  }
}
