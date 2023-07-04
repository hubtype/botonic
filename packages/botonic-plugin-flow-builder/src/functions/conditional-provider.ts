import { ActionRequest } from '@botonic/react'

interface ConditionalProviderArgs {
  request: ActionRequest
  results: string[]
}

export function conditionalProvider({
  request,
  results,
}: ConditionalProviderArgs): string {
  const provider = request.session.user.provider
  if (results.includes(provider)) return provider
  return 'default'
}
