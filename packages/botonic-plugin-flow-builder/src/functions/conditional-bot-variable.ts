import { ActionRequest } from '@botonic/react'

interface ConditionalCountryArgs {
  request: ActionRequest
  results: string[]
  variable: string
}

export function conditionalBotVariable({
  request,
  results,
  variable,
}: ConditionalCountryArgs): string {
  const botVariable = request.session.user.extra_data[variable]
  return results.find(result => result === botVariable) ?? 'default'
}
