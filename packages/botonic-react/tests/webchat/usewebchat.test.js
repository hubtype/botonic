import { act } from '@testing-library/react-hooks'
import { renderUseWebchatHook } from '../helpers/test-utils'

describe('TEST: useWebchat ', () => {
  const testMessage = {
    id: '837da73-899',
    type: 'text',
    data: {
      text: 'Hey!',
    },
    from: 'bot',
    display: false,
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
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.addMessage(testMessage)
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([
      testMessage,
    ])
  })

  it('updateMessage: updates a message with the given properties', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.addMessage(testMessage)
      result.current.updateMessage({ ...testMessage, display: true })
    })
    expect(result.current.webchatState.messagesJSON).toStrictEqual([
      { ...testMessage, display: true },
    ])
  })

  it('addMessageComponent: add testMessage to webchatState.messagesComponents', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.addMessageComponent(testMessage)
    })
    expect(result.current.webchatState.messagesComponents).toStrictEqual([
      testMessage,
    ])
  })

  it('updateReplies: assign false to webchatState.replies', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateReplies(false)
    })
    expect(result.current.webchatState.replies).toEqual(false)
  })

  it('updateLatestInput: assign latestInput to webchatState.latestInput', () => {
    const { result } = renderUseWebchatHook()
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
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateTyping(true)
    })
    expect(result.current.webchatState.typing).toEqual(true)
  })

  it('updateWebview: assign webview to webchatState.webview', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateWebview('webview')
    })
    expect(result.current.webchatState.webview).toEqual('webview')
  })

  it('updateSession: assign initialSession to webchatState.session', () => {
    const { result } = renderUseWebchatHook()
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
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateUser(testUser)
    })
    expect(result.current.webchatState.user).toStrictEqual(testUser)
  })

  it('updateLastRoutePath: assign the string route_path to webchatState.lastRoutePath', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateLastRoutePath('route_path')
    })
    expect(result.current.webchatState.lastRoutePath).toEqual('route_path')
  })

  it('updateHandoff: assign true to webchatState.handoff', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.updateHandoff(true)
    })
    expect(result.current.webchatState.handoff).toEqual(true)
  })

  it('updateTheme: assign theme to webchatState.theme', () => {
    const { result } = renderUseWebchatHook()
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
    expect(result.current.webchatState.themeUpdates).toStrictEqual(undefined)
  })

  it('updateTheme (adding themeUpdates): assign theme to webchatState.theme', () => {
    const { result } = renderUseWebchatHook()
    const theme = {
      style: {
        position: 'fixed',
        right: 20,
      },
      header: {
        title: 'My customized webchat',
      },
    }
    const themeUpdates = {
      brand: {
        color: 'red',
      },
    }
    act(() => {
      result.current.updateTheme(theme, themeUpdates)
    })
    expect(result.current.webchatState.theme).toStrictEqual(theme)
    expect(result.current.webchatState.themeUpdates).toStrictEqual(themeUpdates)
  })

  it('updateDevSettings: assign devSettings to webchatState.devSettings', () => {
    const { result } = renderUseWebchatHook()
    const devSettings = {
      keepSessionOnReload: true,
    }
    act(() => {
      result.current.updateDevSettings(devSettings)
    })
    expect(result.current.webchatState.devSettings).toStrictEqual(devSettings)
  })

  it('toggleWebchat: assign true to webchatState.isWebchatOpen', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    expect(result.current.webchatState.isWebchatOpen).toEqual(true)
  })

  it('toggleEmojiPicker: assign true to webchatState.isEmojiPickerOpen', () => {
    const { result } = renderUseWebchatHook()
    expect(result.current.webchatState.isEmojiPickerOpen).toEqual(false)
    act(() => {
      result.current.toggleEmojiPicker(true)
    })
    expect(result.current.webchatState.isEmojiPickerOpen).toEqual(true)
  })

  it('togglePersistentMenu: assign true to webchatState.isPersistentMenuOpen', () => {
    const { result } = renderUseWebchatHook()
    expect(result.current.webchatState.isPersistentMenuOpen).toEqual(false)
    act(() => {
      result.current.togglePersistentMenu(true)
    })
    expect(result.current.webchatState.isPersistentMenuOpen).toEqual(true)
  })

  it('setError: assign the string error to webchatState.error', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.setError('error')
    })
    expect(result.current.webchatState.error).toEqual('error')
  })

  it('clearMessages: delete testMessage from webchatState.messagesJSON', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.addMessage(testMessage)
      result.current.clearMessages()
    })
    expect(result.current.webchatState.messagesJSON).toEqual([])
  })

  it('setCurrentAttachment: sets current attachment to given object', () => {
    const { result } = renderUseWebchatHook()
    const attachmentObject = { file: 'whatever' }
    act(() => {
      result.current.setCurrentAttachment(attachmentObject)
    })
    expect(result.current.webchatState.currentAttachment).toEqual(
      attachmentObject
    )
  })
})
