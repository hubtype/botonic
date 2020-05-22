import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import Textarea from 'react-textarea-autosize'
import { useLocalStorage } from '@rehooks/local-storage'
import uuid from 'uuid/v4'
import UAParser from 'ua-parser-js'
import { isMobile, params2queryString, INPUT } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Text, Document, Image, Video, Audio } from '../components'
import { TypingIndicator } from './components/typing-indicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious } from './hooks'
import { StyledWebchatHeader } from './header'
import {
  PersistentMenu,
  OpenedPersistentMenu,
} from './components/persistent-menu'
import { Attachment } from './components/attachment'
import { SendButton } from './components/send-button'
import { EmojiPicker, OpenedEmojiPicker } from './components/emoji-picker'
import { WebchatMessageList } from './message-list'
import { WebchatReplies } from './replies'
import { WebviewContainer } from './webview'
import { msgToBotonic } from '../msg-to-botonic'
import {
  isDev,
  resolveImage,
  _getThemeProperty,
  ConditionalWrapper,
  scrollToBottom,
  getParsedAction,
} from '../utils'
import { WEBCHAT, COLORS, MAX_ALLOWED_SIZE_MB } from '../constants'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { DeviceAdapter } from './devices/device-adapter'
import {
  isText,
  isImage,
  isAudio,
  isVideo,
  isDocument,
  isMedia,
  readDataURL,
  isAllowedSize,
  getMediaType,
  getFullMimeWhitelist,
} from '../message-utils'

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
  position: fixed;
  background: ${COLORS.SOLID_WHITE};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 65px;
  height: 65px;
  bottom: 20px;
  right: 10px;
  padding: 8px;
`

const UserInputContainer = styled.div`
  min-height: 52px;
  display: flex;
  position: relative;
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_5};
`

const TextAreaContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
`

const FeaturesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const TriggerImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`

const ErrorMessageContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  background-color: ${COLORS.SOLID_WHITE};
  align-items: center;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
`

const DarkBackgroundMenu = styled.div`
  background: ${COLORS.SOLID_BLACK};
  opacity: 0.3;
  z-index: 1;
  right: 0;
  bottom: 0;
  border-radius: ${props => props.borderRadius || '25px'};
`

const createUser = () => {
  const parser = new UAParser()
  const ua = parser.getResult()
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
    toggleEmojiPicker,
    togglePersistentMenu,
    setError,
    clearMessages,
    openWebviewT,
    closeWebviewT,
    updateLastMessageDate,
    setCurrentAttachment,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.webchatHooks || useWebchat()
  const { theme } = webchatState
  const { initialSession, initialDevSettings, onStateChange } = props
  const [botonicState, saveState, deleteState] = useLocalStorage('botonicState')
  const deviceAdapter = new DeviceAdapter()

  const getThemeProperty = _getThemeProperty(theme)

  const handleAttachment = event => {
    if (!isAllowedSize(event.target.files[0].size)) {
      throw new Error(
        `The file is too large. A maximum of ${MAX_ALLOWED_SIZE_MB}MB is allowed.`
      )
    }
    setCurrentAttachment({
      fileName: event.target.files[0].name,
      file: event.target.files[0], // TODO: Attach more files?
      attachmentType: getMediaType(event.target.files[0].type),
    })
  }

  useEffect(() => {
    if (webchatState.currentAttachment)
      sendAttachment(webchatState.currentAttachment)
  }, [webchatState.currentAttachment])

  // Load initial state from localStorage
  useEffect(() => {
    let {
      user,
      messages,
      session,
      lastRoutePath,
      devSettings,
      lastMessageUpdate,
    } = botonicState || {}
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
          const newComponent = msgToBotonic(
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
    if (lastMessageUpdate) updateLastMessageDate(lastMessageUpdate)
    if (props.onInit) setTimeout(() => props.onInit(), 100)
  }, [])

  useEffect(() => {
    if (!webchatState.isWebchatOpen) return
    deviceAdapter.init()
    scrollToBottom({ behavior: 'auto' })
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
        lastMessageUpdate: webchatState.lastMessageUpdate,
      })
    )
  }, [
    webchatState.user,
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
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

  const handleSelectedEmoji = (event, emojiObject) => {
    textArea.current.value += emojiObject.emoji
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
    togglePersistentMenu(!webchatState.isPersistentMenuOpen)
  }

  const handleEmojiClick = () => {
    toggleEmojiPicker(!webchatState.isEmojiPickerOpen)
  }

  const animationsEnabled = getThemeProperty('animations.enable', true)
  const persistentMenuOptions = getThemeProperty(
    'userInput.persistentMenu',
    props.persistentMenu
  )

  const CustomPersistentMenu = getThemeProperty(
    'userInput.menu.custom',
    undefined
  )
  const darkBackgroundMenu = getThemeProperty(
    'userInput.menu.darkBackground',
    false
  )

  const checkBlockInput = input => {
    // if is a text we check if it is a RE
    const blockInputs = getThemeProperty(
      'userInput.blockInputs',
      props.blockInputs
    )
    if (!Array.isArray(blockInputs)) return false
    for (const rule of blockInputs) {
      if (rule.match.some(regex => regex.test(input.data))) {
        addMessageComponent(
          <Text
            id={input.id}
            from='user'
            blob={false}
            style={{
              backgroundColor: COLORS.SCORPION_GRAY,
              borderColor: COLORS.SCORPION_GRAY,
              padding: '8px 12px',
            }}
          >
            {rule.message}
          </Text>
        )
        updateReplies(false)
        return true
      }
    }
    return false
  }
  const closeMenu = () => {
    togglePersistentMenu(false)
  }

  const messageComponentFromInput = input => {
    let messageComponent = null
    if (isText(input)) {
      messageComponent = (
        <Text id={input.id} payload={input.payload} from='user'>
          {input.data}
        </Text>
      )
    } else if (isMedia(input)) {
      const temporaryDisplayUrl = URL.createObjectURL(input.data)
      const mediaProps = {
        id: input.id,
        from: 'user',
        src: temporaryDisplayUrl,
      }
      if (isImage(input)) messageComponent = <Image {...mediaProps} />
      else if (isAudio(input)) messageComponent = <Audio {...mediaProps} />
      else if (isVideo(input)) messageComponent = <Video {...mediaProps} />
      else if (isDocument(input))
        messageComponent = <Document {...mediaProps} />
    }
    return messageComponent
  }

  const sendInput = async input => {
    if (!input || Object.keys(input).length == 0) return
    if (isText(input) && !input.data) return
    if (isText(input) && checkBlockInput(input)) return
    if (!input.id) input.id = uuid()
    const messageComponent = messageComponentFromInput(input)
    if (messageComponent) addMessageComponent(messageComponent)
    if (isMedia(input)) input.data = await readDataURL(input.data)

    props.onUserInput &&
      props.onUserInput({
        user: webchatState.user,
        input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
    updateLatestInput(input)
    updateLastMessageDate(new Date())
    updateReplies(false)
    togglePersistentMenu(false)
    toggleEmojiPicker(false)
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
        const action = session._botonic_action || ''
        const handoff = action.startsWith('create_case')
        if (handoff && isDev()) addMessageComponent(<Handoff />)
        updateHandoff(handoff)
      }
      if (lastRoutePath) updateLastRoutePath(lastRoutePath)
      updateLastMessageDate(new Date())
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
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openWebviewApi: component => openWebviewT(component),
    setError,
    getMessages: () => webchatState.messagesJSON,
    clearMessages: () => {
      clearMessages()
    },
    getLastMessageUpdate: () => webchatState.lastMessageUpdate,
    updateMessageInfo: (msgId, messageInfo) => {
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id == msgId
      )[0]
      updateMessage({ ...messageToUpdate, ...messageInfo })
    },
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
      const action = getParsedAction(prevSession._botonic_action)
      if (action && action.on_finish) sendPayload(action.on_finish)
    }
  }, [webchatState.session._botonic_action])

  const sendText = async (text, payload) => {
    if (!text) return
    const input = { type: INPUT.TEXT, data: text, payload }
    await sendInput(input)
  }

  const sendPayload = async payload => {
    if (!payload) return
    const input = { type: INPUT.POSTBACK, payload }
    await sendInput(input)
  }

  const sendAttachment = async attachment => {
    if (attachment.file) {
      const attachmentType = getMediaType(attachment.file.type)
      if (!attachmentType) return
      const input = {
        type: attachmentType,
        data: attachment.file,
      }
      await sendInput(input)
      setCurrentAttachment(undefined)
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

  const webviewRequestContext = {
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
    if (!webchatState.isWebchatOpen && props.onClose) {
      props.onClose()
      toggleEmojiPicker(false)
      togglePersistentMenu(false)
    }
  }, [webchatState.isWebchatOpen])

  const textArea = useRef()

  const getTriggerImage = () => {
    const triggerImage = getThemeProperty('triggerButton.image', null)
    if (triggerImage === null) {
      webchatState.theme.triggerButtonImage = WEBCHAT.DEFAULTS.LOGO
      return null
    }
    return triggerImage
  }

  const triggerButtonStyle = getThemeProperty('triggerButton.style')

  const CustomTriggerButton = getThemeProperty(
    'triggerButton.custom',
    undefined
  )

  const triggerButton = () => {
    if (CustomTriggerButton) {
      return <CustomTriggerButton />
    }
    return (
      <StyledTriggerButton style={{ ...triggerButtonStyle }}>
        {getTriggerImage() && (
          <TriggerImage src={resolveImage(getTriggerImage())} />
        )}
      </StyledTriggerButton>
    )
  }

  const webchatMessageList = () => (
    <WebchatMessageList
      style={{ flex: 1 }}
      messages={webchatState.messagesComponents}
    >
      {webchatState.typing && <TypingIndicator />}
    </WebchatMessageList>
  )
  const webchatReplies = () => <WebchatReplies replies={webchatState.replies} />

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
  const CustomMenuButton = getThemeProperty(
    'userInput.menuButton.custom',
    undefined
  )

  const ConditionalAnimation = props => (
    <ConditionalWrapper
      condition={animationsEnabled}
      wrapper={children => (
        <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
      )}
    >
      {props.children}
    </ConditionalWrapper>
  )

  const userInputArea = () => {
    return (
      userInputEnabled && (
        <UserInputContainer
          style={{
            ...getThemeProperty('userInput.style'),
          }}
        >
          {webchatState.isEmojiPickerOpen && (
            <OpenedEmojiPicker
              height={webchatState.theme.style.height}
              onEmojiClick={handleSelectedEmoji}
              onClick={handleEmojiClick}
            />
          )}
          {persistentMenuOptions && (
            <FeaturesWrapper>
              <ConditionalAnimation>
                <div onClick={handleMenu}>
                  {CustomMenuButton ? <CustomMenuButton /> : <PersistentMenu />}
                </div>
              </ConditionalAnimation>
            </FeaturesWrapper>
          )}
          <TextAreaContainer>
            <Textarea
              name='text'
              onFocus={() => deviceAdapter.onFocus()}
              onBlur={() => deviceAdapter.onBlur()}
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
                fontSize: deviceAdapter.fontSize(14),
                width: '100%',
                border: 'none',
                resize: 'none',
                overflow: 'auto',
                outline: 'none',
                flex: '1 1 auto',
                padding: 10,
                paddingLeft: persistentMenuOptions ? 0 : 10,
                fontFamily: 'inherit',
                ...getThemeProperty('userInput.box.style'),
              }}
            />
          </TextAreaContainer>
          <FeaturesWrapper>
            {emojiPickerEnabled && (
              <ConditionalAnimation>
                <EmojiPicker onClick={handleEmojiClick} />
              </ConditionalAnimation>
            )}
            {attachmentsEnabled && (
              <ConditionalAnimation>
                <Attachment
                  onChange={handleAttachment}
                  accept={getFullMimeWhitelist().join(',')}
                />
              </ConditionalAnimation>
            )}
            {(sendButtonEnabled || CustomSendButton) && (
              <ConditionalAnimation>
                <div onClick={sendTextAreaText}>
                  {CustomSendButton ? <CustomSendButton /> : <SendButton />}
                </div>
              </ConditionalAnimation>
            )}
          </FeaturesWrapper>
        </UserInputContainer>
      )
    )
  }

  const webchatWebview = () => (
    <RequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...getThemeProperty('webview.style'),
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
          {triggerButton()}
        </div>
      )}
      {webchatState.isWebchatOpen && (
        <StyledWebchat
          // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          id={'botonic-webchat'}
          width={webchatState.width}
          height={webchatState.height}
          style={{
            ...webchatState.theme.style,
            ...mobileStyle,
          }}
        >
          <StyledWebchatHeader
            onCloseClick={() => {
              toggleWebchat(false)
            }}
          />
          {webchatState.error.message ? (
            <ErrorMessageContainer>
              Error: {webchatState.error.message}
            </ErrorMessageContainer>
          ) : (
            <>
              {webchatMessageList()}
              {webchatState.replies &&
                Object.keys(webchatState.replies).length > 0 &&
                webchatReplies()}
              {webchatState.isPersistentMenuOpen && (
                <div>
                  {darkBackgroundMenu && (
                    <DarkBackgroundMenu
                      borderRadius={webchatState.theme.style.borderRadius}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  )}
                  {CustomPersistentMenu ? (
                    <CustomPersistentMenu
                      onClick={closeMenu}
                      options={persistentMenuOptions}
                    />
                  ) : (
                    <OpenedPersistentMenu
                      onClick={closeMenu}
                      options={persistentMenuOptions}
                      borderRadius={
                        webchatState.theme.style.borderRadius || '10px'
                      }
                    />
                  )}
                </div>
              )}
              {!webchatState.handoff && userInputArea()}
              {webchatState.webview && webchatWebview()}
            </>
          )}
        </StyledWebchat>
      )}
    </WebchatContext.Provider>
  )
})
