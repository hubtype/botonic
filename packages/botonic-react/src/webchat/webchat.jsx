import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react'
import Textarea from 'react-textarea-autosize'
import { useLocalStorage } from '@rehooks/local-storage'
import uuid from 'uuid/v4'
import UAParser from 'ua-parser-js'
import { Flex } from '@rebass/grid'
import { params2queryString } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Text } from '../components/text'
import { TypingIndicator } from '../components/typingIndicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious } from './hooks'
import { WebchatHeader } from './header'
import { WebchatMenu } from './menu'
import { WebchatMessageList } from './messageList'
import { WebchatReplies } from './replies'
import { WebviewContainer } from './webview'
import { isDev, msgToBotonic } from '../utils'
import Logo from './botonic_react_logo100x100.png'
import EmojiPicker from 'emoji-picker-react'

const getScriptBaseURL = () => {
  let scriptBaseURL = document
    .querySelector('script[src$="webchat.botonic.js"]')
    .getAttribute('src')
  let scriptName = scriptBaseURL.split('/').pop()
  return scriptBaseURL.replace('/' + scriptName, '/')
}

const createUser = () => {
  let parser = new UAParser()
  let ua = parser.getResult()
  let name = `${ua.os.name} ${ua.browser.name}`
  if (ua.device && ua.device.type) name = `${ua.device.type} ${name}`
  return {
    id: uuid(),
    name
  }
}

export const Webchat = forwardRef((props, ref) => {
  const {
    webchatState,
    addMessage,
    addMessageComponent,
    updateMessage,
    updateReplies,
    updateTyping,
    updateWebview,
    updateSession,
    updateUser,
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    toggleWebchat,
    openWebviewT,
    closeWebviewT
  } = props.webchatHooks || useWebchat()
  const { initialSession, initialDevSettings } = props
  const [botonicState, saveState, deleteState] = useLocalStorage('botonicState')

  const [menuIsOpened, setMenuIsOpened] = useState(false)
  const [emojiIsOpened, setemojiIsOpened] = useState(false)
  // Load initial state from localStorage
  useEffect(() => {
    let { user, messages, session, lastRoutePath, devSettings } =
      botonicState || {}
    if (!user || Object.keys(user).length == 0) user = createUser()
    updateUser(user)
    if (
      !devSettings ||
      Object.keys(devSettings).length == 0 ||
      devSettings.keepSessionOnReload
    ) {
      if (messages) {
        messages.map(m => {
          addMessage(m)
          let newComponent = msgToBotonic({ ...m, delay: 0, typing: 0 })
          if (newComponent) addMessageComponent(newComponent)
        })
      }
      if (session) updateSession(session)
      else if (initialSession) updateSession(initialSession)
      if (lastRoutePath) updateLastRoutePath(lastRoutePath)
    } else updateSession(initialSession)
    if (devSettings) updateDevSettings(devSettings)
    else if (initialDevSettings) updateDevSettings(initialDevSettings)
    if (props.onInit) setTimeout(() => props.onInit(), 100)
  }, [])

  useEffect(() => {
    if (!webchatState.isWebchatOpen) return
    setTimeout(() => {
      let end = document.getElementById('messages-end')
      if (end) {
        end.scrollIntoView()
      }
    })
  }, [webchatState.isWebchatOpen])

  useEffect(() => {
    saveState(
      JSON.stringify({
        user: webchatState.user,
        messages: webchatState.messagesJSON,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
        devSettings: webchatState.devSettings
      })
    )
  }, [
    webchatState.user,
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings
  ])

  useTyping({ webchatState, updateTyping, updateMessage })

  useEffect(() => {
    updateTheme({ ...webchatState.theme, ...props.theme })
  }, [props.theme])

  const openMenu = () => {
    if (menuIsOpened) {
      setMenuIsOpened(false)
    } else {
      setMenuIsOpened(true)
    }
  }
  const openEmoji = () => {
    if (emojiIsOpened) {
      setemojiIsOpened(false)
    } else {
      setemojiIsOpened(true)
    }
  }
  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params)

  const myCallback = code => {
    const emoji = String.fromCodePoint(`0x${code}`)
    textArea.current.value += emoji
  }

  const closeWebview = options => {
    updateWebview()
    textArea.current.focus()
    if (options && options.payload) {
      sendPayload(options.payload)
    } else if (options && options.path) {
      let params = ''
      if (options.params) params = params2queryString(options.params)
      sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
    }
  }

  const sendInput = async input => {
    let inputMessage = null
    if (!input || Object.keys(input).length == 0) return
    if (!input.id) input.id = uuid()
    if (input.type === 'text') {
      inputMessage = (
        <Text id={input.id} from="user" payload={input.payload}>
          {input.data}
        </Text>
      )
    }
    if (inputMessage) {
      addMessageComponent(inputMessage)
      updateReplies(false)
    }
    props.onUserInput &&
      props.onUserInput({
        user: webchatState.user,
        input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath
      })
  }

  /* This is the public API this component exposes to its parents
  https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  */
  useImperativeHandle(ref, () => ({
    addBotResponse: ({ response, session, lastRoutePath }) => {
      updateTyping(false)
      if (Array.isArray(response)) response.map(r => addMessageComponent(r))
      else if (response) addMessageComponent(response)
      if (session) {
        updateSession(session)
        let action = session._botonic_action || ''
        let handoff = action.startsWith('create_case')
        if (handoff && isDev()) addMessageComponent(<Handoff />)
        updateHandoff(handoff)
      }
      if (lastRoutePath) updateLastRoutePath(lastRoutePath)
    },
    setTyping: typing => updateTyping(typing),
    addUserMessage: message => sendInput(message),
    updateUser: user => {
      updateSession({
        ...webchatState.session,
        user: { ...webchatState.session.user, ...user }
      })
      updateUser({ ...webchatState.user, ...user })
    },
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openWebviewApi: component => openWebviewT(component)
  }))

  const resolveCase = () => {
    updateHandoff(false)
    updateSession({ ...webchatState.session, _botonic_action: null })
  }

  const prevSession = usePrevious(webchatState.session)
  useEffect(() => {
    // Resume conversation after handoff
    if (
      prevSession &&
      prevSession._botonic_action &&
      !webchatState.session._botonic_action
    ) {
      let action = prevSession._botonic_action.split(':')
      sendPayload(action[action.length - 1])
    }
  }, [webchatState.session._botonic_action])

  const sendText = async (text, payload) => {
    if (!text) return
    let input = { type: 'text', data: text, payload }
    await sendInput(input)
  }

  const sendPayload = async payload => {
    if (!payload) return
    let input = { type: 'postback', payload }
    await sendInput(input)
  }

  const onKeyDown = event => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault()
      sendText(textArea.current.value)
      textArea.current.value = ''
    }
  }

  const choiceMenu = menu => {
    return <Menu options={webchatState.theme.customMenu} />
  }

  let webviewRequestContext = {
    getString: stringId => props.getString(stringId, webchatState.session),
    setLocale: locale => props.getString(locale, webchatState.session),
    session: webchatState.session || {},
    params: webchatState.webviewParams || {},
    closeWebview: closeWebview
  }

  useEffect(() => {
    if (webchatState.isWebchatOpen && props.onOpen) props.onOpen()
    if (!webchatState.isWebchatOpen && props.onClose) props.onClose()
  }, [webchatState.isWebchatOpen])

  const textArea = useRef()
  const staticAssetsUrl = getScriptBaseURL()

  const CustomTriggerButton = webchatState.theme.customTriggerButton
  let logoUrl = Logo
  if (props.theme && props.theme.brandIconUrl)
    logoUrl = props.theme.brandIconUrl
  if (webchatState.theme && webchatState.theme.brandIconUrl)
    logoUrl = webchatState.theme.brandIconUrl
  const triggerButton = CustomTriggerButton ? (
    <CustomTriggerButton />
  ) : (
    <div
      style={{
        cursor: 'pointer',
        position: 'fixed',
        background: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        bottom: 20,
        right: 10,
        ...webchatState.theme.triggerButtonStyle
      }}
    >
      <img
        style={{
          height: 50
        }}
        src={staticAssetsUrl + logoUrl}
      />
    </div>
  )

  return (
    <WebchatContext.Provider
      value={{
        sendText,
        sendPayload,
        openWebview,
        resolveCase,
        webchatState,
        addMessage,
        toggleWebchat,
        updateMessage,
        updateReplies,
        staticAssetsUrl
      }}
    >
      {!webchatState.isWebchatOpen && (
        <div
          onClick={event => {
            toggleWebchat(true)
            event.preventDefault()
          }}
        >
          {triggerButton}
        </div>
      )}
      {webchatState.isWebchatOpen && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: webchatState.width,
            height: webchatState.height,
            margin: 'auto',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 0 12px rgba(0,0,0,.15)',
            display: 'flex',
            flexDirection: 'column',
            ...webchatState.theme.style
          }}
        >
          <WebchatHeader
            style={{
              borderRadius: '8px 8px 0 0',
              boxShadow: 'rgba(176, 196, 222, 0.5) 0px 2px 5px',
              height: 36,
              flex: 'none'
            }}
          />
          <WebchatMessageList
            style={{ flex: 1 }}
            messages={webchatState.messagesComponents}
          >
            {webchatState.typing && <TypingIndicator />}
            <div id="messages-end" />
          </WebchatMessageList>
          {webchatState.replies && (
            <WebchatReplies replies={webchatState.replies} />
          )}
          {/* {webchatState.webviewOption.isOpen && (
            <webchatState.webviewOption.component />
          )} */}
          {menuIsOpened && choiceMenu(webchatState.theme.customMenu)}
          {emojiIsOpened && (
            <EmojiPicker style={{ width: 300 }} onEmojiClick={myCallback} />
          )}
          {/* {!webchatState.handoff && <WebchatMenu />} */}
          {!webchatState.handoff && (
            <Textarea
              name="text"
              minRows={2}
              maxRows={4}
              wrap="soft"
              maxLength="1000"
              placeholder={webchatState.theme.textPlaceholder}
              autoFocus={location.hostname === 'localhost'}
              inputRef={textArea}
              onKeyDown={e => onKeyDown(e)}
              style={{
                display: 'flex',
                padding: '8px 10px',
                fontSize: 14,
                border: 'none',
                borderTop: '1px solid rgba(0, 0, 0, 0.4)',
                resize: 'none',
                overflow: 'auto',
                outline: 'none'
              }}
            />
          )}
          {webchatState.webview && (
            <RequestContext.Provider value={webviewRequestContext}>
              <WebviewContainer
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
                webview={webchatState.webview}
              />
            </RequestContext.Provider>
          )}
        </div>
      )}
    </WebchatContext.Provider>
  )
})
