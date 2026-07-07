import { getWebviewInDevMode } from '../../src/webchat/webview/index'

function TestWebview() {
  return null
}

function createWebchatState(webview) {
  return { webview }
}

describe('getWebviewInDevMode', () => {
  it('resolves a webview descriptor by name from localWebviews', () => {
    const resolved = getWebviewInDevMode(
      [TestWebview],
      createWebchatState({ name: 'TestWebview' })
    )

    expect(resolved).toBe(TestWebview)
  })

  it('returns a React component directly when passed as webview', () => {
    const resolved = getWebviewInDevMode([], createWebchatState(TestWebview))

    expect(resolved).toBe(TestWebview)
  })

  it('preserves string webviews for intrinsic element rendering', () => {
    const resolved = getWebviewInDevMode([], createWebchatState('webview'))

    expect(resolved).toBe('webview')
  })

  it('throws a clear error when the local webview name is not registered', () => {
    expect(() =>
      getWebviewInDevMode(
        [TestWebview],
        createWebchatState({ name: 'MissingWebview' })
      )
    ).toThrow(
      'Local webview "MissingWebview" not found. Registered webviews: TestWebview'
    )
  })

  it('throws when no local webviews are registered', () => {
    expect(() =>
      getWebviewInDevMode(
        undefined,
        createWebchatState({ name: 'FlowBuilderWebview' })
      )
    ).toThrow(
      'Local webview "FlowBuilderWebview" not found. Registered webviews: none'
    )
  })
})
