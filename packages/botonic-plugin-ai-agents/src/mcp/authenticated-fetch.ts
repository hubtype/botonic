import { getAccessToken, invalidateToken } from './oauth-token-provider'
import type { McpOAuthClientCredentials } from './types'

/**
 * Builds a `fetch` implementation that injects an OAuth2 bearer token (cached
 * per `oauth-token-provider`) plus any extra static headers into every
 * request. On a 401/403 it invalidates the token and retries once.
 *
 * It is passed to `MCPServerStreamableHttp` via its `fetch` option, so the
 * SDK's `StreamableHTTPClientTransport` uses it for every MCP request
 * (initialize, tools/list, tools/call) without needing the SDK's
 * `OAuthClientProvider`.
 */
export function createAuthenticatedFetch(
  auth: McpOAuthClientCredentials,
  extraHeaders?: Record<string, string>
): typeof fetch {
  const buildHeaders = (init: RequestInit | undefined): Headers => {
    const headers = new Headers(init?.headers)
    if (extraHeaders) {
      for (const [key, value] of Object.entries(extraHeaders)) {
        headers.set(key, value)
      }
    }
    return headers
  }

  return (async (input, init) => {
    const token = await getAccessToken(auth)
    const headers = buildHeaders(init)
    headers.set('Authorization', `Bearer ${token}`)

    const response = await fetch(input, { ...init, headers })

    if (response.status === 401 || response.status === 403) {
      invalidateToken(auth)
      const retryToken = await getAccessToken(auth)
      const retryHeaders = buildHeaders(init)
      retryHeaders.set('Authorization', `Bearer ${retryToken}`)
      return fetch(input, { ...init, headers: retryHeaders })
    }

    return response
  }) as typeof fetch
}
