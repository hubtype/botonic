import { useWebchat } from '../../src/webchat/hooks'
import { renderHook, act } from '@testing-library/react-hooks'

describe('Testing useWebchat ', () => {
  const testMessage = {
    id: '837da73-899',
    type: 'text',
    data: {
      text: 'Hey!',
    },
    from: 'bot',
  }
  it('addMessage: add testMessage to webchatState: { messagesJSON }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessage(testMessage)
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([
      testMessage,
    ])
  })
  it('addMessageComponent: add testMessage to webchatState: { messagesComponents }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessageComponent(testMessage)
    })
    expect(result.current.webchatState.messagesComponents).toStrictEqual([
      testMessage,
    ])
  })
  it('updateMessage: replace testMessage with testUpdateMessage in webchatState: { messagesComponents }', () => {
    //falla funcionament ??
    const { result } = renderHook(() => useWebchat())
    const testUpdateMessage = {
      id: '345gh-89jn9',
      type: 'text',
      data: {
        text: 'Hola',
      },
      from: 'user',
    }
    act(() => {
      result.current.addMessage(testMessage)
      result.current.updateMessage(testUpdateMessage)
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([])
  })
  it('updateReplies: assigne false to webchatState: { replies }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateReplies(false)
    })
    expect(result.current.webchatState.replies).toStrictEqual(false)
  })
  it('updateLatestInput: assigne latestInput to webchatState: { latestInput }', () => {
    const { result } = renderHook(() => useWebchat())
    const latestInput = {
      id: 'f65feb4e-9',
      payload: 'greetings',
      type: 'postback',
    }
    act(() => {
      result.current.updateLatestInput(latestInput)
    })
    expect(result.current.webchatState.latestInput).toStrictEqual(latestInput)
  })
  it('updateTyping: assigne true to webchatState: { typing }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateTyping(true)
    })
    expect(result.current.webchatState.typing).toStrictEqual(true)
  })
  it('updateWebview: assigne webview to webchatState: { webview }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateWebview('webview')
    })
    expect(result.current.webchatState.webview).toStrictEqual('webview')
  })
  it('updateSession: assigne initialSession to webchatState: { session }', () => {
    const { result } = renderHook(() => useWebchat())
    const initialSession = {
      is_first_interaction: true,
      last_session: {},
      user: {
        id: '000001',
        username: 'johndoe',
        name: 'John Doe',
        provider: 'dev',
        provider_id: '0000000',
        extra_data: {},
      },
      organization: '',
      bot: {
        id: '0000000',
        name: 'botName',
      },
    }
    act(() => {
      result.current.updateSession(initialSession)
    })
    expect(result.current.webchatState.session).toStrictEqual(initialSession)
  })
  it('updateUser: assigne testUser to webchatState: { user }', () => {
    const { result } = renderHook(() => useWebchat())
    const testUser = {
      id: '000001',
      username: 'johndoe',
      name: 'John Doe',
      provider: 'dev',
      provider_id: '0000000',
      extra_data: {},
    }
    act(() => {
      result.current.updateUser(testUser)
    })
    expect(result.current.webchatState.user).toStrictEqual(testUser)
  })
  it('updateLastRoutePath: assigne the string route_path to webchatState: { lastRoutePath }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateLastRoutePath('route_path')
    })
    expect(result.current.webchatState.lastRoutePath).toStrictEqual(
      'route_path'
    )
  })
  it('updateHandoff: assigne true to webchatState: { handoff }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateHandoff(true)
    })
    expect(result.current.webchatState.handoff).toStrictEqual(true)
  })
  it('updateTheme: assigne theme to webchatState: { theme }', () => {
    const { result } = renderHook(() => useWebchat())
    const theme = {
      style: {
        position: 'fixed',
        right: 20,
      },
      header: {
        title: 'My customized webchat',
      },
    }
    act(() => {
      result.current.updateTheme(theme)
    })
    expect(result.current.webchatState.theme).toStrictEqual({
      style: {
        position: 'fixed',
        right: 20,
      },
      header: {
        title: 'My customized webchat',
      },
    })
  })
  it('updateDevSettings: assigne dev to webchatState: { devSettings }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateDevSettings('dev')
    })
    expect(result.current.webchatState.devSettings).toStrictEqual({
      '0': 'd',
      '1': 'e',
      '2': 'v',
    })
  })
  it('toggleWebchat: assigne true to webchatState: { isWebchatOpen }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.toggleWebchat(true)
    })
    expect(result.current.webchatState.isWebchatOpen).toStrictEqual(true)
  })
  it('setError: assigne the string error to webchatState: { error }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.setError('error')
    })
    expect(result.current.webchatState.error).toStrictEqual('error')
  })
  it('clearMessages: delate testMessage from webchatState: { messagesJSON }', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessage(testMessage)
      result.current.clearMessages()
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([])
  })
})

// messagesComponents, replies, webview, error, devSettings -> canviar input
