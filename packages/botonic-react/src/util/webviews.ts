import { params2queryString } from '@botonic/core'

export function generateWebviewUrlWithParams(
  webview: any,
  params: any = ''
): string {
  const webviewParams = params ? params2queryString(params) : ''
  return `/webviews/${webview.name}?${webviewParams}`
}
