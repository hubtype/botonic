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
import { params2queryString } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Text } from '../components/text'
import { TypingIndicator } from '../components/typingIndicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious } from './hooks'
import { WebchatHeader } from './header'
import { PersistentMenu } from '../components/persistentMenu'
import { WebchatMessageList } from './messageList'
import { WebchatReplies } from './replies'
import { WebviewContainer } from './webview'
import { isDev, staticAsset } from '../utils'
import Logo from './botonic_react_logo100x100.png'
import EmojiPicker from 'emoji-picker-react'
import LogoMenu from './menuButton.svg'
import LogoEmoji from './emojiButton.svg'
import { Button } from '../components/button'
import {msgToBotonic} from "../msgToBotonic";

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
    updateLatestInput,
    updateTyping,
    updateWebview,
    updateSession,
    updateUser,
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    toggleWebchat,
    setError,
    openWebviewT,
    closeWebviewT
  } = props.webchatHooks || useWebchat()
  const { initialSession, initialDevSettings, onStateChange } = props
  const [botonicState, saveState, deleteState] = useLocalStorage('botonicState')
  const [menuIsOpened, setMenuIsOpened] = useState(false)
  const [emojiIsOpened, setEmojiIsOpened] = useState(false)
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
          let newComponent = msgToBotonic(
            { ...m, delay: 0, typing: 0 },
            props.theme.customMessageTypes
          )
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
    if (onStateChange && typeof onStateChange === 'function')
      onStateChange(webchatState)
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

  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params)

  const emojiClick = code => {
    const emoji = String.fromCodePoint(`0x${code}`)
    textArea.current.value += emoji
    textArea.current.focus()
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

  const handleMenu = () => {
    setEmojiIsOpened(false)
    menuIsOpened ? setMenuIsOpened(false) : setMenuIsOpened(true)
  }
  const handleEmoji = () => {
    emojiIsOpened ? setEmojiIsOpened(false) : setEmojiIsOpened(true)
  }
  const emojiPickerComponent = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 15
        }}
      >
        <img
          style={{
            cursor: 'pointer'
          }}
          src={staticAsset(LogoEmoji)}
          onClick={() => handleEmoji()}
        />
      </div>
    )
  }

  const persistentMenuComponent = () => (
    <PersistentMenu>
      {Object.values(props.persistentMenu).map((e, i) => {
        return (
          <Button
            onClick={closeMenu}
            url={e.url}
            webview={e.webview}
            payload={e.payload}
            key={i}
          >
            {Object.values(e.label)}
          </Button>
        )
      })}
      <Button onClick={closeMenu}>Cancel</Button>
    </PersistentMenu>
  )
  const persistentMenuLogo = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        cursor: 'pointer',
        padding: 18
      }}
      onClick={() => handleMenu()}
    >
      <img src={staticAsset(LogoMenu)} />
    </div>
  )

  const checkBlockInput = input => {
    if (!Array.isArray(props.blockInputs)) return
    for (let rule of props.blockInputs) {
      if (rule.match.some(regex => regex.test(input.data))) {
        addMessageComponent(
          <Text
            id={input.id}
            from='user'
            style={{ backgroundColor: '#585757', borderColor: '#585757' }}
          >
            {rule.message}
          </Text>
        )
        updateReplies(false)
        return true
      }
    }
  }
  const closeMenu = () => {
    setMenuIsOpened(false)
  }

  const sendInput = async input => {
    let inputMessage = null
    if (!input || Object.keys(input).length == 0) return
    if (!input.id) input.id = uuid()
    //if is a text we check if it is a RE
    if (input.type === 'text') {
      if (checkBlockInput(input)) return
      inputMessage = (
        <Text id={input.id} payload={input.payload} from='user'>
          {input.data}
        </Text>
      )
    }
    if (inputMessage) {
      addMessageComponent(inputMessage)
    }
    props.onUserInput &&
      props.onUserInput({
        user: webchatState.user,
        input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath
      })
    updateLatestInput(input)
    updateReplies(false)
    setMenuIsOpened(false)
    setEmojiIsOpened(false)
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
    openWebviewApi: component => openWebviewT(component),
    setError
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

  let webviewRequestContext = {
    getString: stringId => props.getString(stringId, webchatState.session),
    setLocale: locale => props.getString(locale, webchatState.session),
    session: webchatState.session || {},
    params: webchatState.webviewParams || {},
    closeWebview: closeWebview,
    defaultDelay: props.defaultDelay || 0,
    defaultTyping: props.defaultTyping || 0
  }

  useEffect(() => {
    if (webchatState.isWebchatOpen && props.onOpen) props.onOpen()
    if (!webchatState.isWebchatOpen && props.onClose) props.onClose()
  }, [webchatState.isWebchatOpen])

  const textArea = useRef()

  const CustomTriggerButton = webchatState.theme.customTrigger
  let triggerImage = Logo
  if (props.theme && 'triggerButtonImage' in props.theme)
    triggerImage = props.theme.triggerButtonImage
  if (webchatState.theme && 'triggerButtonImage' in webchatState.theme)
    triggerImage = webchatState.theme.triggerButtonImage
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
        overflow: 'hidden',
        width: 65,
        height: 65,
        bottom: 20,
        paddding: 8,
        right: 10,
        ...webchatState.theme.triggerButtonStyle
      }}
    >
      {triggerImage && (
        <img
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={staticAsset(triggerImage)}
        />
      )}
    </div>
  )

  const webchatHeader = () => (
    <WebchatHeader
      style={{
        borderRadius: '8px 8px 0 0',
        boxShadow: 'rgba(176, 196, 222, 0.5) 0px 2px 5px',
        height: 36,
        flex: 'none'
      }}
      onCloseClick={() => {
        toggleWebchat(false)
      }}
    />
  )
  const webchatMessageList = () => (
    <WebchatMessageList
      style={{ flex: 1 }}
      messages={webchatState.messagesComponents}
    >
      {webchatState.typing && <TypingIndicator />}
      <div id='messages-end' />
    </WebchatMessageList>
  )
  const webchatReplies = () => (
    <WebchatReplies
      replies={webchatState.replies}
      align={webchatState.theme.alignReplies}
      wrap={webchatState.theme.wrapReplies}
    />
  )
  const emoji = () => (
    <div
      style={{
        width: webchatState.theme.width || '100%',
        maxWidth: 400,
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 0,
        top: -332
      }}
    >
      <EmojiPicker onEmojiClick={emojiClick} />
    </div>
  )
  const inputUserArea = () => {
    return (
      <div
        style={{
          minHeight: 52,
          display: 'flex',
          position: 'relative',
          borderTop: '1px solid rgba(0, 0, 0, 0.4)'
        }}
      >
        {emojiIsOpened && emoji()}
        {props.persistentMenu && persistentMenuLogo()}
        <div
          style={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center'
          }}
        >
          <Textarea
            name='text'
            maxRows={4}
            wrap='soft'
            maxLength='1000'
            placeholder={webchatState.theme.textPlaceholder}
            autoFocus={location.hostname === 'localhost'}
            inputRef={textArea}
            onKeyDown={e => onKeyDown(e)}
            style={{
              display: 'flex',
              fontSize: 14,
              width: '100%',
              border: 'none',
              resize: 'none',
              overflow: 'auto',
              outline: 'none',
              flex: '1 1 auto',
              padding: 10,
              paddingLeft: props.persistentMenu ? 0 : 10
            }}
          />
        </div>
        {props.emojiPicker && emojiPickerComponent()}
      </div>
    )
  }
  const webchatWebview = () => (
    <RequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...props.theme.webviewStyle
        }}
        webview={webchatState.webview}
      />
    </RequestContext.Provider>
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
        updateLatestInput
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
          {webchatHeader()}
          {webchatState.error.message ? (
            <div
              style={{
                flex: '1 1 auto',
                display: 'flex',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              Error: {webchatState.error.message}
            </div>
          ) : (
            <>
              {webchatMessageList()}
              {webchatState.replies &&
                Object.keys(webchatState.replies).length > 0 &&
                webchatReplies()}
              {menuIsOpened && persistentMenuComponent()}
              {!webchatState.handoff && inputUserArea()}
              {webchatState.webview && webchatWebview()}
            </>
          )}
        </div>
      )}
    </WebchatContext.Provider>
  )
})
