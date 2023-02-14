export function conditionalProvider({ session, results }): string {
  const provider = session.user.provider
  if (results.includes(provider)) return provider
  return 'default'
}
