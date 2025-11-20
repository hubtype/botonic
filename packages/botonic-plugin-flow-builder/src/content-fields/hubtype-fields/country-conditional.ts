import { HtBaseNode } from './common'
import { HtFunctionResult } from './function'
import { HtNodeWithContentType } from './node-types'

export interface HtCountryConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'check-country'
    result_mapping: HtFunctionResult[]
  }
}
