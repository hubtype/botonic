import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import Textarea from 'react-textarea-autosize'
import { useLocalStorage } from '@rehooks/local-storage'
import uuid from 'uuid/v4'
import UAParser from 'ua-parser-js'
import { isMobile, params2queryString } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Text, Document, Image, Video, Audio } from '../components'
import { TypingIndicator } from '../components/typing-indicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious } from './hooks'
import { WebchatHeader } from './header'
import { PersistentMenu } from '../components/persistent-menu'
import { Attachment } from '../components/attachment'
import { SendButton } from '../components/send-button'
import { WebchatMessageList } from './message-list'
import { WebchatReplies } from './replies'
import { WebviewContainer } from './webview'
import { msgToBotonic } from '../msg-to-botonic'
import {
  isDev,
  staticAsset,
  _getThemeProperty,
  ConditionalWrapper,
} from '../utils'
import EmojiPicker from 'emoji-picker-react'
import LogoMenu from '../assets/menuButton.svg'
import LogoEmoji from '../assets/emojiButton.svg'
import { WEBCHAT, MIME_WHITELIST, COLORS } from '../constants'
import { motion } from 'framer-motion'
import styled from 'styled-components'

const getAttachmentType = fileType => {
  return Object.entries(MIME_WHITELIST)
    .filter(([k, v]) => v.includes(fileType))
    .map(([k, v]) => k)[0]
}

const StyledWebchat = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: auto;
  background-color: ${COLORS.SOLID_WHITE};
  border-radius: 10px;
  box-shadow: ${COLORS.SOLID_BLACK_ALPHA_0_2} 0px 0px 12px;
  display: flex;
  flex-direction: column;
`

const StyledTriggerButton = styled.div`
  cursor: pointer;
  position: absolute;
  background: ${COLORS.SOLID_WHITE};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  bottom: 20px;
  right: 10px;
`

const createUser = () => {
  let parser = new UAParser()
  let ua = parser.getResult()
  let name = `${ua.os.name} ${ua.browser.name}`
  if (ua.device && ua.device.type) name = `${ua.device.type} ${name}`
  return {
    id: uuid(),
    name,
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
    closeWebviewT,
  } = props.webchatHooks || useWebchat()
  const { theme } = webchatState
  const { initialSession, initialDevSettings, onStateChange } = props
  const [botonicState, saveState, deleteState] = useLocalStorage('botonicState')
  const [persistentMenuOpened, setPersistentMenuOpened] = useState(false)
  const [emojiPickerOpened, setEmojiPickerOpened] = useState(false)
  const [attachment, setAttachment] = useState({})

  const getThemeProperty = _getThemeProperty(theme)

  const handleAttachment = event => {
    setAttachment({
      fileName: event.target.files[0].name,
      file: event.target.files[0], // TODO: Attach more files?
      attachmentType: getAttachmentType(event.target.files[0].type),
    })
  }

  useEffect(() => {
    sendAttachment(attachment)
  }, [attachment])

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
            (props.theme.message && props.theme.message.customTypes) ||
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
        devSettings: webchatState.devSettings,
      })
    )
  }, [
    webchatState.user,
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
  ])

  useTyping({ webchatState, updateTyping, updateMessage })

  useEffect(() => {
    if (props.theme && props.theme.style) {
      props.theme.style = { ...theme.style, ...props.theme.style }
    }
    updateTheme({ ...theme, ...props.theme })
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
    if (userInputEnabled) {
      textArea.current.focus()
    }
    if (options && options.payload) {
      sendPayload(options.payload)
    } else if (options && options.path) {
      let params = ''
      if (options.params) params = params2queryString(options.params)
      sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
    }
  }

  const handleMenu = () => {
    setEmojiPickerOpened(false)
    persistentMenuOpened
      ? setPersistentMenuOpened(false)
      : setPersistentMenuOpened(true)
  }

  const handleEmoji = () => {
    emojiPickerOpened ? setEmojiPickerOpened(false) : setEmojiPickerOpened(true)
  }
  const EmojiPickerComponent = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingRight: 15,
      }}
    >
      <img
        style={{
          cursor: 'pointer',
        }}
        src={staticAsset(LogoEmoji)}
        onClick={() => handleEmoji()}
      />
    </div>
  )
  const animationsEnabled = getThemeProperty('animations.enable', true)
  const persistentMenuOptions = getThemeProperty(
    'userInput.persistentMenu',
    props.persistentMenu
  )

  const persistentMenuLogo = () => (
    <ConditionalWrapper
      condition={animationsEnabled}
      wrapper={children => (
        <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
      )}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          cursor: 'pointer',
          padding: 18,
        }}
        onClick={() => handleMenu()}
      >
        <img src={staticAsset(LogoMenu)} />
      </div>
    </ConditionalWrapper>
  )

  const checkBlockInput = input => {
    let blockInputs = getThemeProperty(
      'userInput.blockInputs',
      props.blockInputs
    )
    if (!Array.isArray(blockInputs)) return
    for (let rule of blockInputs) {
      if (rule.match.some(regex => regex.test(input.data))) {
        addMessageComponent(
          <Text
            id={input.id}
            from='user'
            style={{
              backgroundColor: COLORS.SCORPION_GRAY,
              borderColor: COLORS.SCORPION_GRAY,
            }}
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
    setPersistentMenuOpened(false)
  }

  const sendInput = async input => {
    let inputMessage = null
    if (!input || Object.keys(input).length == 0) return
    if (!input.id) input.id = uuid()
    //if is a text we check if it is a RE
    if (input.type === 'text') {
      if (!input.data) return
      if (checkBlockInput(input)) return
      inputMessage = (
        <Text id={input.id} payload={input.payload} from='user'>
          {input.data}
        </Text>
      )
    }
    if (input.type == 'image') {
      inputMessage = <Image id={input.id} src={input.data} from='user' />
    }
    if (input.type == 'audio') {
      inputMessage = <Audio id={input.id} src={input.data} from='user' />
    }
    if (input.type == 'video') {
      // This is set willfully since if we set this 'src' to video data will surpass the limits of localStorage
      inputMessage = <Video id={input.id} src={''} from='user' />
    }
    if (input.type == 'document') {
      inputMessage = <Document id={input.id} src={input.data} from='user' />
    }
    if (inputMessage) {
      addMessageComponent(inputMessage)
    }
    props.onUserInput &&
      props.onUserInput({
        user: webchatState.user,
        input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
    updateLatestInput(input)
    updateReplies(false)
    setPersistentMenuOpened(false)
    setEmojiPickerOpened(false)
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
        user: { ...webchatState.session.user, ...user },
      })
      updateUser({ ...webchatState.user, ...user })
    },
    getMessages: () => webchatState.messagesJSON,
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openWebviewApi: component => openWebviewT(component),
    setError,
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

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })

  const sendAttachment = async attachment => {
    if (attachment.file) {
      let attachmentType = getAttachmentType(attachment.file.type)
      if (!attachmentType) return
      let input = {
        type: attachmentType,
        data: await toBase64(attachment.file),
      }
      await sendInput(input)
    }
  }

  const sendTextAreaText = () => {
    sendText(textArea.current.value)
    textArea.current.value = ''
  }

  const onKeyDown = event => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault()
      sendTextAreaText()
    }
  }

  let webviewRequestContext = {
    getString: stringId => props.getString(stringId, webchatState.session),
    setLocale: locale => props.getString(locale, webchatState.session),
    session: webchatState.session || {},
    params: webchatState.webviewParams || {},
    closeWebview: closeWebview,
    defaultDelay: props.defaultDelay || 0,
    defaultTyping: props.defaultTyping || 0,
  }

  useEffect(() => {
    if (webchatState.isWebchatOpen && props.onOpen) props.onOpen()
    if (!webchatState.isWebchatOpen && props.onClose) props.onClose()
  }, [webchatState.isWebchatOpen])

  const textArea = useRef()

  const triggerImage = getThemeProperty(
    'triggerButton.image',
    WEBCHAT.DEFAULTS.LOGO
  )
  const triggerButtonStyle = getThemeProperty('triggerButton.style', {})
  const CustomTriggerButton = getThemeProperty(
    'triggerButton.custom',
    undefined
  )

  const triggerButton = CustomTriggerButton ? (
    <CustomTriggerButton />
  ) : (
    <StyledTriggerButton style={{ ...triggerButtonStyle }}>
      {triggerImage && (
        <img
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={staticAsset(triggerImage)}
        />
      )}
    </StyledTriggerButton>
  )
  const webchatHeader = () => (
    <WebchatHeader
      style={{
        borderRadius: '8px 8px 0 0',
        boxShadow: `${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px`,
        height: 36,
        flex: 'none',
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
  const webchatReplies = () => <WebchatReplies replies={webchatState.replies} />
  const emoji = () => (
    <div
      style={{
        width: theme.width || '100%',
        maxWidth: 400,
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 0,
        top: -332,
      }}
    >
      <EmojiPicker onEmojiClick={emojiClick} />
    </div>
  )
  const userInputEnabled = getThemeProperty('userInput.enable', true)
  const emojiPickerEnabled = getThemeProperty(
    'userInput.emojiPicker.enable',
    props.enableEmojiPicker
  )
  const attachmentsEnabled = getThemeProperty(
    'userInput.attachments.enable',
    props.enableAttachments
  )
  const sendButtonEnabled = getThemeProperty(
    'userInput.sendButton.enable',
    true
  )
  const CustomSendButton = getThemeProperty(
    'userInput.sendButton.custom',
    undefined
  )
  const inputUserArea = () => {
    return (
      userInputEnabled && (
        <div
          style={{
            minHeight: 52,
            display: 'flex',
            position: 'relative',
            borderTop: `1px solid ${COLORS.SOLID_BLACK_ALPHA_0_5}`,
            ...getThemeProperty('userInput.style', {}),
          }}
        >
          {emojiPickerOpened && emoji()}
          {persistentMenuOptions && persistentMenuLogo()}
          <div
            style={{
              display: 'flex',
              flex: '1 1 auto',
              alignItems: 'center',
            }}
          >
            <Textarea
              name='text'
              maxRows={4}
              wrap='soft'
              maxLength='1000'
              placeholder={getThemeProperty(
                'userInput.box.placeholder',
                WEBCHAT.DEFAULTS.PLACEHOLDER
              )}
              autoFocus={true}
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
                paddingLeft: persistentMenuOptions ? 0 : 10,
                fontFamily: 'inherit',
                ...getThemeProperty('userInput.box.style', {}),
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {emojiPickerEnabled && (
              <ConditionalWrapper
                condition={animationsEnabled}
                wrapper={children => (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    {children}
                  </motion.div>
                )}
              >
                <EmojiPickerComponent />
              </ConditionalWrapper>
            )}
            {attachmentsEnabled && (
              <ConditionalWrapper
                condition={animationsEnabled}
                wrapper={children => (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    {children}
                  </motion.div>
                )}
              >
                <Attachment
                  onChange={handleAttachment}
                  accept={Object.values(MIME_WHITELIST)
                    .map(v => v.join(','))
                    .join(',')}
                />
              </ConditionalWrapper>
            )}
            {(sendButtonEnabled || CustomSendButton) && (
              <ConditionalWrapper
                condition={animationsEnabled}
                wrapper={children => (
                  <motion.div whileHover={{ scale: 1.2 }}>
                    {children}
                  </motion.div>
                )}
              >
                <div onClick={sendTextAreaText}>
                  {CustomSendButton ? <CustomSendButton /> : <SendButton />}
                </div>
              </ConditionalWrapper>
            )}
          </div>
        </div>
      )
    )
  }

  const webchatWebview = () => (
    <RequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...getThemeProperty('webview.style', {}),
          ...mobileStyle,
        }}
        webview={webchatState.webview}
      />
    </RequestContext.Provider>
  )
  let mobileStyle = {}
  if (isMobile(webchatState.theme.mobileBreakpoint)) {
    mobileStyle = {
      width: '100%',
      height: '100%',
      right: 0,
      bottom: 0,
      borderRadius: 0,
    }
  }

  return (
    <WebchatContext.Provider
      value={{
        sendText,
        sendAttachment,
        sendPayload,
        sendInput,
        openWebview,
        resolveCase,
        webchatState,
        getThemeProperty,
        addMessage,
        toggleWebchat,
        updateMessage,
        updateReplies,
        updateLatestInput,
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
        <StyledWebchat
          width={webchatState.width}
          height={webchatState.height}
          style={{
            ...webchatState.theme.style,
          }}
        >
          {webchatHeader()}
          {webchatState.error.message ? (
            <div
              style={{
                flex: '1 1 auto',
                display: 'flex',
                backgroundColor: `${COLORS.SOLID_WHITE}`,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Arial, Helvetica, sans-serif',
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
              {persistentMenuOpened && (
                <PersistentMenu
                  onClick={closeMenu}
                  options={persistentMenuOptions}
                />
              )}
              {!webchatState.handoff && inputUserArea()}
              {webchatState.webview && webchatWebview()}
            </>
          )}
        </StyledWebchat>
      )}
    </WebchatContext.Provider>
  )
})
