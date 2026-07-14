import { generateWebviewUrlWithParams } from '../../src/util/webviews'

describe('generateWebviewUrlWithParams', () => {
  it('returns webview url without params', () => {
    expect(generateWebviewUrlWithParams({ name: 'MyWebview' })).toBe(
      '/webviews/MyWebview?'
    )
  })

  it('serializes params with URLSearchParams', () => {
    expect(
      generateWebviewUrlWithParams(
        { name: 'MyWebview' },
        { numbers: '123', redirectUri: 'www.some-site.com' }
      )
    ).toBe('/webviews/MyWebview?numbers=123&redirectUri=www.some-site.com')
  })
})
