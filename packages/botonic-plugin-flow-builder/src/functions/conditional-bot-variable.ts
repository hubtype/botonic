import { ActionRequest } from '@botonic/react'

import { getValueFromKeyPath } from '../utils'

interface ConditionalBotVariableArgs {
  request: ActionRequest
  results: (string | boolean | number)[]
  keyPath: string
}

export function conditionalBotVariable({
  request,
  results,
  keyPath,
}: ConditionalBotVariableArgs): string | boolean | number {
  const botVariable = getValueFromKeyPath(request, keyPath)

  if (isBooleanConditional(results) && typeof botVariable !== 'boolean') {
    return (
      results.find(
        result => result === (botVariable !== undefined && botVariable !== null)
      ) ?? 'default'
    )
  }

  return results.find(result => result === botVariable) ?? 'default'
}

function isBooleanConditional(results: (string | boolean | number)[]): boolean {
  return (
    results.some(result => result === true) &&
    results.some(result => result === false) &&
    results.some(result => result === 'default')
  )
}
