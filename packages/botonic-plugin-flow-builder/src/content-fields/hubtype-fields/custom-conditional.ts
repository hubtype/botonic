import { HtBaseNode } from './common'
import { HtFunctionArguments, HtFunctionResult } from './function'
import { HtNodeWithContentType } from './node-types'

export interface HtCustomConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'check-bot-variable'
    arguments: HtFunctionArguments[]
    result_mapping: HtFunctionResult[]
  }
}
