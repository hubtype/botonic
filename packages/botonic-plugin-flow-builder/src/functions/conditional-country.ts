import { ActionRequest } from '@botonic/react'

interface ConditionalCountryArgs {
  request: ActionRequest
  results: string[]
}

export function conditionalCountry({
  request,
  results,
}: ConditionalCountryArgs): string {
  const country = request.getUserCountry()
  return results.find(result => result === country) || 'default'
}
