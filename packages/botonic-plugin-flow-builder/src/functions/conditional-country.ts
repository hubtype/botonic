import { ActionRequest } from '@botonic/react'

interface ConditionalCountryArgs {
  request: ActionRequest
  results: string[]
}

export function conditionalCountry({
  request,
  results,
}: ConditionalCountryArgs): string {
  const country = request.session.user.extra_data.country
  return results.find(result => result === country) || 'default'
}
