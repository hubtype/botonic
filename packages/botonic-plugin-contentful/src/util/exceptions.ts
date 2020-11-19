export function isError(e: any): e is Error {
  const exception = e as Error
  return !!exception.name && !!exception.message
}
