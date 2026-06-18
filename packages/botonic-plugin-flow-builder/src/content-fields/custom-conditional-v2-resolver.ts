import {
  type HtCondition,
  type HtNodeLink,
  type HtNumberCondition,
  type HtStringCondition,
  VariableFormat,
} from './hubtype-fields'

export type ConditionMatch = {
  customResult: string
  target: HtNodeLink
}

export function getConditionCustomResult(
  condition: HtCondition,
  variableFormat: VariableFormat
): string {
  switch (variableFormat) {
    case VariableFormat.String:
      return String((condition as HtStringCondition).value)
    case VariableFormat.Number:
      return String((condition as HtNumberCondition).value)
    case VariableFormat.Boolean:
      // Only reached after evaluateBooleanCondition succeeds; today that is isTruthy → 'true'
      return 'true'
    default:
      throw new Error(`Invalid variable format ${variableFormat}`)
  }
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
  }
}
