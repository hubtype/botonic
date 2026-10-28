import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtUpdateVariablesNode extends HtBaseNode {
  type: HtNodeWithContentType.UPDATE_VARIABLES
  content: {
    set_variables: Record<string, string | number | boolean>
    unset_variables: string[]
  }
}
