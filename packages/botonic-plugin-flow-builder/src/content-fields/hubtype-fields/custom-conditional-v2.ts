import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export enum VariableFormat {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
}

export enum StringConditionOperator {
  Contains = 'contains',
  NotContains = 'notContains',
  EqualsTo = 'equalsTo',
  NotEqualsTo = 'notEqualsTo',
  StartsWith = 'startsWith',
  NotStartsWith = 'notStartsWith',
  EndsWith = 'endsWith',
  NotEndsWith = 'notEndsWith',
}

export interface HtStringCondition {
  operator: StringConditionOperator
  value?: string
  target?: HtNodeLink
}

export enum NumberConditionOperator {
  EqualsTo = 'equalsTo',
  NotEqualsTo = 'notEqualsTo',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  GreaterThanOrEqualTo = 'greaterThanOrEqualTo',
  LessThanOrEqualTo = 'lessThanOrEqualTo',
  Between = 'between',
  NotBetween = 'notBetween',
}

export interface HtNumberCondition {
  operator: NumberConditionOperator
  value?: number
  min?: number
  max?: number
  target?: HtNodeLink
}

export enum BooleanConditionOperator {
  IsTruthy = 'isTruthy',
}

export interface HtBooleanCondition {
  operator: BooleanConditionOperator
  target?: HtNodeLink
}

export type HtCondition =
  | HtStringCondition
  | HtNumberCondition
  | HtBooleanCondition

export interface HtCustomConditionalV2Node extends HtBaseNode {
  type: HtNodeWithContentType.CUSTOM_CONDITION
  content: {
    type: VariableFormat
    key_path: string
    conditions: HtCondition[]
    default_target: HtNodeLink
  }
}
