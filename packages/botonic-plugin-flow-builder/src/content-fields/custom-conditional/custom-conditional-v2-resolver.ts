import {
  type HtCondition,
  type HtNodeLink,
  type HtNumberCondition,
  type HtStringCondition,
  NumberConditionOperator,
  VariableFormat,
} from '../hubtype-fields'

export type ConditionMatch = {
  customResult: string
  target: HtNodeLink
  operator: string
}

export function getConditionCustomResult(
  condition: HtCondition,
  variableFormat: VariableFormat
): string {
  switch (variableFormat) {
    case VariableFormat.String:
      return String((condition as HtStringCondition).value)
    case VariableFormat.Number:
      return getNumberConditionCustomResult(condition as HtNumberCondition)
    case VariableFormat.Boolean:
      // Only reached after evaluateBooleanCondition succeeds; today that is isTruthy → 'true'
      return 'true'
    default:
      throw new Error(`Invalid variable format ${variableFormat}`)
  }
}

function getNumberConditionCustomResult(condition: HtNumberCondition): string {
  const numberCondition = condition as HtNumberCondition
  if (
    numberCondition.operator === NumberConditionOperator.Between ||
    numberCondition.operator === NumberConditionOperator.NotBetween
  ) {
    return `min: ${numberCondition.min} - max: ${numberCondition.max}`
  }
  return String(numberCondition.value)
}

export function findLastMatchingCondition<T extends HtCondition>(
  conditions: T[],
  variable: unknown,
  variableFormat: VariableFormat,
  evaluate: (variable: unknown, condition: T) => boolean
): ConditionMatch | undefined {
  let lastMatch: ConditionMatch | undefined

  for (const condition of conditions) {
    if (!evaluate(variable, condition)) {
      continue
    }

    if (!condition.target) {
      continue
    }

    lastMatch = {
      customResult: getConditionCustomResult(condition, variableFormat),
      target: condition.target,
      operator: condition.operator,
    }
  }

  return lastMatch
}

export function resolveWithDefaultTarget(
  match: ConditionMatch | undefined,
  defaultTarget: HtNodeLink,
  nodeCode: string,
  defaultCustomResult: string = 'default'
): ConditionMatch {
  if (match) {
    return match
  }

  if (!defaultTarget) {
    throw new Error(
      `Default target not found for custom condition node ${nodeCode}`
    )
  }

  return {
    customResult: defaultCustomResult,
    target: defaultTarget,
    operator: '',
  }
}
