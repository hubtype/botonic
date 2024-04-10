import { params2queryString } from '@botonic/core'

export function generateWebviewUrlWithParams(
  webview: any,
  params: any = ''
): string {
  let webviewParams = ''
  if (params) webviewParams = params2queryString(params)
  return `/webviews/${webview.name}?${webviewParams}`
}
