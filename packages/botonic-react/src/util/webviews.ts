import type { Webview } from '../components/index-types'

export function generateWebviewUrlWithParams(
  webview: Webview,
  params?: Record<string, string>
): string {
  const webviewParams = params ? new URLSearchParams(params).toString() : ''
  return `/webviews/${webview.name}?${webviewParams}`
}
