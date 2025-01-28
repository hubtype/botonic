import { isBrowser } from '@botonic/core'

export function isMobile(): boolean {
  if (isBrowser()) {
    const userAgent = window?.navigator?.userAgent
    const platform = window?.navigator?.platform
    return (
      platform.startsWith('iP') ||
      userAgent.includes('Android') ||
      userAgent.includes('iPhone') ||
      userAgent.includes('Windows Phone')
    )
  }
  return false
}
