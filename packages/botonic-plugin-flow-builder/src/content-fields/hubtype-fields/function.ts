import { HtBaseNode, HtNodeLink } from './common'
import { HtNodeWithContentType } from './node-types'

export enum HtArgumentType {
  NUMBER = 'number',
  STRING = 'string',
  JSON = 'json',
}

export interface HtFunctionArgument {
  type: HtArgumentType
  name: string
  value: string
}

export interface HtFunctionArgumentLocale {
  locale: string
  values: HtFunctionArgument[]
}

export interface HtFunctionResult {
  result: string
  target?: HtNodeLink
}

export interface HtFunctionNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string
    arguments: HtFunctionArgumentLocale[]
    result_mapping: HtFunctionResult[]
  }
}
