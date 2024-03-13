import { ActionRequest } from '@botonic/react'

import { getValueFromKeyPath } from '../utils'

interface ConditionalCountryArgs {
  request: ActionRequest
  results: string[]
  keyPath: string
}

export function conditionalBotVariable({
  request,
  results,
  keyPath,
}: ConditionalCountryArgs): string {
  const botVariable = getValueFromKeyPath(request, keyPath)
  return results.find(result => result === botVariable) ?? 'default'
}
