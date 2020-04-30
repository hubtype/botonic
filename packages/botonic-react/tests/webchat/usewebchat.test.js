import { useWebchat } from '../../src/webchat/hooks'
import { renderHook, act } from '@testing-library/react-hooks'

describe('TEST: useWebchat ', () => {
  const testMessage = {
    id: '837da73-899',
    type: 'text',
    data: {
      text: 'Hey!',
    },
    from: 'bot',
  }

  const testUser = {
    id: '000001',
    username: 'johndoe',
    name: 'John Doe',
    provider: 'dev',
    provider_id: '0000000',
    extra_data: {},
  }

  it('addMessage: add testMessage to webchatState.messagesJSON', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessage(testMessage)
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([
      testMessage,
    ])
  })

  it('addMessageComponent: add testMessage to webchatState.messagesComponents', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessageComponent(testMessage)
    })
    expect(result.current.webchatState.messagesComponents).toStrictEqual([
      testMessage,
    ])
  })

  it('updateReplies: assign false to webchatState.replies', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateReplies(false)
    })
    expect(result.current.webchatState.replies).toEqual(false)
  })

  it('updateLatestInput: assign latestInput to webchatState.latestInput', () => {
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

  it('updateTyping: assign true to webchatState.typing', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateTyping(true)
    })
    expect(result.current.webchatState.typing).toEqual(true)
  })

  it('updateWebview: assign webview to webchatState.webview', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateWebview('webview')
    })
    expect(result.current.webchatState.webview).toEqual('webview')
  })

  it('updateSession: assign initialSession to webchatState.session', () => {
    const { result } = renderHook(() => useWebchat())
    const initialSession = {
      is_first_interaction: true,
      last_session: {},
      user: testUser,
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

  it('updateUser: assign testUser to webchatState.user', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateUser(testUser)
    })
    expect(result.current.webchatState.user).toStrictEqual(testUser)
  })

  it('updateLastRoutePath: assign the string route_path to webchatState.lastRoutePath', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateLastRoutePath('route_path')
    })
    expect(result.current.webchatState.lastRoutePath).toEqual('route_path')
  })

  it('updateHandoff: assign true to webchatState.handoff', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.updateHandoff(true)
    })
    expect(result.current.webchatState.handoff).toEqual(true)
  })

  it('updateTheme: assign theme to webchatState.theme', () => {
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
    expect(result.current.webchatState.theme).toStrictEqual(theme)
  })

  it('updateDevSettings: assign devSettings to webchatState.devSettings', () => {
    const { result } = renderHook(() => useWebchat())
    const devSettings = {
      keepSessionOnReload: true,
    }
    act(() => {
      result.current.updateDevSettings(devSettings)
    })
    expect(result.current.webchatState.devSettings).toStrictEqual(devSettings)
  })

  it('toggleWebchat: assign true to webchatState.isWebchatOpen', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.toggleWebchat(true)
    })
    expect(result.current.webchatState.isWebchatOpen).toEqual(true)
  })

  it('setError: assign the string error to webchatState.error', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.setError('error')
    })
    expect(result.current.webchatState.error).toEqual('error')
  })

  it('clearMessages: delete testMessage from webchatState.messagesJSON', () => {
    const { result } = renderHook(() => useWebchat())
    act(() => {
      result.current.addMessage(testMessage)
      result.current.clearMessages()
    })
    expect(result.current.webchatState.messagesJSON).toEqual([])
  })
})
//missing test of updateMessage
