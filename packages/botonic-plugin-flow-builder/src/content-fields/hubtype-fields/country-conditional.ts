import type { HtBaseNode } from './common'
import type { HtFunctionResult } from './function'
import type { HtNodeWithContentType } from './node-types'

export interface HtCountryConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'check-country'
    result_mapping: HtFunctionResult[]
  }
}
