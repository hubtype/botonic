import type { McpOAuthClientCredentials } from './types'

interface CachedToken {
  token: string
  /** Epoch milliseconds at which the token expires. */
  expiresAt: number
}

const DEFAULT_REFRESH_SKEW_SECONDS = 60
const DEFAULT_EXPIRES_IN_SECONDS = 3600

// Module-level cache so warm Lambda invocations reuse the same token.
// Keyed by `tokenUrl|clientId|scope` (a Viva app has a 60 tokens / 10 min cap).
const tokenCache = new Map<string, CachedToken>()
// In-flight token requests, deduped so concurrent callers share one fetch.
const inFlightRequests = new Map<string, Promise<CachedToken>>()

function cacheKey(auth: McpOAuthClientCredentials): string {
  return [auth.tokenUrl, auth.clientId, auth.scope ?? ''].join('|')
}

function refreshSkewMs(auth: McpOAuthClientCredentials): number {
  return (auth.refreshSkewSeconds ?? DEFAULT_REFRESH_SKEW_SECONDS) * 1000
}

function isFresh(
  cached: CachedToken,
  auth: McpOAuthClientCredentials
): boolean {
  return cached.expiresAt - refreshSkewMs(auth) > Date.now()
}

interface TokenResponse {
  access_token: string
  expires_in?: number
}

async function fetchToken(
  auth: McpOAuthClientCredentials
): Promise<CachedToken> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: auth.clientId,
    client_secret: auth.clientSecret,
  })
  if (auth.scope) {
    body.set('scope', auth.scope)
  }

  const response = await fetch(auth.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new Error(
      `OAuth token request failed: ${response.status} ${response.statusText}`
    )
  }

  const data = (await response.json()) as TokenResponse
  if (!data.access_token) {
    throw new Error('OAuth token response did not include access_token')
  }

  const expiresInMs = (data.expires_in ?? DEFAULT_EXPIRES_IN_SECONDS) * 1000
  return {
    token: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  }
}

/**
 * Returns a cached OAuth2 access token, refreshing it (with skew) when it is
 * about to expire. Concurrent callers share a single in-flight request.
 */
export async function getAccessToken(
  auth: McpOAuthClientCredentials
): Promise<string> {
  const key = cacheKey(auth)

  const cached = tokenCache.get(key)
  if (cached && isFresh(cached, auth)) {
    return cached.token
  }

  const inFlight = inFlightRequests.get(key)
  if (inFlight) {
    return (await inFlight).token
  }

  const promise = fetchToken(auth)
    .then(token => {
      tokenCache.set(key, token)
      inFlightRequests.delete(key)
      return token
    })
    .catch(error => {
      inFlightRequests.delete(key)
      throw error
    })
  inFlightRequests.set(key, promise)

  return (await promise).token
}

/**
 * Drops the cached token so the next `getAccessToken` fetches a fresh one.
 * Used after a 401/403 to retry the original request exactly once.
 */
export function invalidateToken(auth: McpOAuthClientCredentials): void {
  tokenCache.delete(cacheKey(auth))
}

/** @internal Reset all module-level state. For tests only. */
export function __resetTokenCache(): void {
  tokenCache.clear()
  inFlightRequests.clear()
}
