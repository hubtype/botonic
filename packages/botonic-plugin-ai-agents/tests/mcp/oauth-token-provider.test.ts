import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
  __resetTokenCache,
  getAccessToken,
  invalidateToken,
} from '../../src/mcp/oauth-token-provider'
import type { McpOAuthClientCredentials } from '../../src/mcp/types'

const AUTH: McpOAuthClientCredentials = {
  tokenUrl: 'https://auth.example.com/token',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  scope: 'viva',
}

interface TokenResponse {
  access_token: string
  expires_in: number
}

const tokenResponse = (body: TokenResponse): Response =>
  ({
    ok: true,
    status: 200,
    json: async () => body,
  }) as Response

describe('oauth-token-provider', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    __resetTokenCache()
    fetchMock = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ access_token: 'tok-1', expires_in: 3600 }),
    }))
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('fetches a token on first call and caches it (no refetch)', async () => {
    const token = await getAccessToken(AUTH)
    expect(token).toBe('tok-1')
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const cached = await getAccessToken(AUTH)
    expect(cached).toBe('tok-1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('refreshes when the token is within the skew window', async () => {
    // expires_in=10s but skew=60s => the token is already considered stale.
    const auth: McpOAuthClientCredentials = { ...AUTH, refreshSkewSeconds: 60 }
    fetchMock.mockResolvedValueOnce(
      tokenResponse({ access_token: 'tok-2', expires_in: 10 }) as never
    )

    await getAccessToken(auth)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Skew > lifetime => not fresh => refetch.
    fetchMock.mockResolvedValueOnce(
      tokenResponse({ access_token: 'tok-3', expires_in: 10 }) as never
    )
    const token = await getAccessToken(auth)
    expect(token).toBe('tok-3')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('dedupes concurrent in-flight requests', async () => {
    let resolveFetch!: (value: Response) => void
    const pending = new Promise<Response>(resolve => {
      resolveFetch = resolve
    })
    fetchMock.mockReturnValueOnce(pending as never)

    const p1 = getAccessToken(AUTH)
    const p2 = getAccessToken(AUTH)

    resolveFetch(tokenResponse({ access_token: 'tok-1', expires_in: 3600 }))

    const [a, b] = await Promise.all([p1, p2])
    expect(a).toBe('tok-1')
    expect(b).toBe('tok-1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('invalidates the cached token so the next call refetches', async () => {
    await getAccessToken(AUTH)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    invalidateToken(AUTH)

    fetchMock.mockResolvedValueOnce(
      tokenResponse({ access_token: 'tok-2', expires_in: 3600 }) as never
    )
    const token = await getAccessToken(AUTH)
    expect(token).toBe('tok-2')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws when the token request fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({}),
    } as never)

    await expect(getAccessToken(AUTH)).rejects.toThrow(
      /OAuth token request failed: 401/
    )
  })
})
