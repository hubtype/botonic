export function conditionalProvider({ request, results }): string {
  const provider = request.session.user.provider
  if (results.includes(provider)) return provider
  return 'default'
}
