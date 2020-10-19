import { CmsException } from '../cms'

export function isError(e: any): e is Error {
  const exception = e as Error
  return !!exception.name && !!exception.message
}

export function ensureError(e: any): Error {
  if (isError(e)) {
    return e
  }
  return new CmsException(String(e), undefined)
}
