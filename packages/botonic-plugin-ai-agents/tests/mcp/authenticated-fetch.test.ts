import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { createAuthenticatedFetch } from '../../src/mcp/authenticated-fetch'
import { __resetTokenCache } from '../../src/mcp/oauth-token-provider'

const TOKEN_URL = 'https://auth.example.com/token'

const AUTH = {
  tokenUrl: TOKEN_URL,
  clientId: 'client-id',
  clientSecret: 'client-secret',
  scope: 'viva',
}

describe('createAuthenticatedFetch', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    __resetTokenCache()
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('injects the OAuth bearer and extra static headers', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchMock.mockImplementation((input: any) => {
      const url = String(input)
      if (url === TOKEN_URL) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ access_token: 'tok-1', expires_in: 3600 }),
        })
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => ({}) })
    })

    const authedFetch = createAuthenticatedFetch(AUTH, { 'X-Custom': 'viva' })
    await authedFetch('https://api.example.com/tools/call', { method: 'POST' })

    // First call = token request.
    expect(String(fetchMock.mock.calls[0][0])).toBe(TOKEN_URL)

    // Second call = the resource request with the injected headers.
    const resourceCall = fetchMock.mock.calls[1]
    expect(String(resourceCall[0])).toBe('https://api.example.com/tools/call')
    const headers = new Headers(
      (resourceCall[1] as RequestInit | undefined)?.headers
    )
    expect(headers.get('Authorization')).toBe('Bearer tok-1')
    expect(headers.get('X-Custom')).toBe('viva')
  })

  it('retries once on 401 after invalidating the token', async () => {
    let tokenSeq = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchMock.mockImplementation((input: any, init?: any) => {
      const url = String(input)
      if (url === TOKEN_URL) {
        tokenSeq += 1
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            access_token: `tok-${tokenSeq}`,
            expires_in: 3600,
          }),
        })
      }
      const isFirstAttempt =
        new Headers(init?.headers).get('Authorization') === 'Bearer tok-1'
      return Promise.resolve({
        ok: !isFirstAttempt,
        status: isFirstAttempt ? 401 : 200,
        json: async () => ({}),
      })
    })

    const authedFetch = createAuthenticatedFetch(AUTH)
    const response = await authedFetch('https://api.example.com/tools/call')

    // Token + resource(401) + token(invalidate) + resource(200) = 4 calls.
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(response.status).toBe(200)
  })
})
