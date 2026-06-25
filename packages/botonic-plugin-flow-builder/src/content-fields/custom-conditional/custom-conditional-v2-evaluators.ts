import {
  BooleanConditionOperator,
  type HtBooleanCondition,
  type HtNumberCondition,
  type HtStringCondition,
  NumberConditionOperator,
  StringConditionOperator,
} from '../hubtype-fields'

type StringEvaluator = (variable: string, value: string) => boolean

type NumberEvaluator = (
  variable: number,
  value: number,
  condition: HtNumberCondition
) => boolean

type BooleanEvaluator = (variable: boolean) => boolean

export function getMinAndMax(condition: HtNumberCondition): {
  min: number
  max: number
} {
  if (condition.min !== undefined && condition.max !== undefined) {
    return { min: condition.min, max: condition.max }
  }
  throw new Error(
    `Min or max not found for number condition ${condition.operator}`
  )
}

export const STRING_CONDITION_EVALUATORS: Record<
  StringConditionOperator,
  StringEvaluator
> = {
  [StringConditionOperator.Contains]: (variable, value) =>
    variable.includes(value),
  [StringConditionOperator.NotContains]: (variable, value) =>
    !variable.includes(value),
  [StringConditionOperator.EqualsTo]: (variable, value) => variable === value,
  [StringConditionOperator.NotEqualsTo]: (variable, value) =>
    variable !== value,
  [StringConditionOperator.StartsWith]: (variable, value) =>
    variable.startsWith(value),
  [StringConditionOperator.NotStartsWith]: (variable, value) =>
    !variable.startsWith(value),
  [StringConditionOperator.EndsWith]: (variable, value) =>
    variable.endsWith(value),
  [StringConditionOperator.NotEndsWith]: (variable, value) =>
    !variable.endsWith(value),
}

export const NUMBER_CONDITION_EVALUATORS: Record<
  NumberConditionOperator,
  NumberEvaluator
> = {
  [NumberConditionOperator.EqualsTo]: (variable, value) => variable === value,
  [NumberConditionOperator.NotEqualsTo]: (variable, value) =>
    variable !== value,
  [NumberConditionOperator.GreaterThan]: (variable, value) => variable > value,
  [NumberConditionOperator.LessThan]: (variable, value) => variable < value,
  [NumberConditionOperator.GreaterThanOrEqualTo]: (variable, value) =>
    variable >= value,
  [NumberConditionOperator.LessThanOrEqualTo]: (variable, value) =>
    variable <= value,
  [NumberConditionOperator.Between]: (variable, _value, condition) => {
    const { min, max } = getMinAndMax(condition)
    return variable >= min && variable <= max
  },
  [NumberConditionOperator.NotBetween]: (variable, _value, condition) => {
    const { min, max } = getMinAndMax(condition)
    return variable < min || variable > max
  },
}

export const BOOLEAN_CONDITION_EVALUATORS: Record<
  BooleanConditionOperator,
  BooleanEvaluator
> = {
  [BooleanConditionOperator.IsTruthy]: variable => !!variable,
}

export function evaluateStringCondition(
  variable: string,
  condition: HtStringCondition
): boolean {
  if (condition.value === undefined) {
    throw new Error(
      `Value not found for string condition ${condition.operator}`
    )
  }
  const evaluator = STRING_CONDITION_EVALUATORS[condition.operator]
  if (!evaluator) {
    throw new Error(`Invalid string condition operator ${condition.operator}`)
  }
  return evaluator(variable, condition.value)
}

export function evaluateNumberCondition(
  variable: number,
  condition: HtNumberCondition
): boolean {
  if (condition.value === undefined) {
    throw new Error(
      `Value not found for number condition ${condition.operator}`
    )
  }
  const evaluator = NUMBER_CONDITION_EVALUATORS[condition.operator]
  if (!evaluator) {
    throw new Error(`Invalid number condition operator ${condition.operator}`)
  }
  return evaluator(variable, condition.value, condition)
}

export function evaluateBooleanCondition(
  variable: boolean,
  condition: HtBooleanCondition
): boolean {
  const evaluator = BOOLEAN_CONDITION_EVALUATORS[condition.operator]
  if (!evaluator) {
    throw new Error(`Invalid boolean condition operator ${condition.operator}`)
  }
  return evaluator(variable)
}
