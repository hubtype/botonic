import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import Textarea from 'react-textarea-autosize'
import { useStorageState } from './use-storage-state-hook'
import { v4 as uuidv4 } from 'uuid'
import UAParser from 'ua-parser-js'
import { isMobile, params2queryString, INPUT } from '@botonic/core'
import { WebchatContext, RequestContext } from '../contexts'
import { Text, Document, Image, Video, Audio } from '../components'
import { TypingIndicator } from './components/typing-indicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious, useNetwork } from './hooks'
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
  deserializeRegex,
  stringifyWithRegexs,
} from '../utils'
import { WEBCHAT, COLORS, MAX_ALLOWED_SIZE_MB, SENDERS } from '../constants'
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

import { normalizeWebchatSettings } from '../components/webchat-settings'

import merge from 'lodash.merge'
import { useAsyncEffect } from 'use-async-effect'

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
  position: relative;
  display: flex;
  z-index: 1;
  justify-content: center;
  width: 100%;
`

const ErrorMessage = styled.div`
  position: absolute;
  top: 10px;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 11px;
  display: flex;
  background-color: ${COLORS.ERROR_RED};
  color: ${COLORS.CONCRETE_WHITE};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-family: ${WEBCHAT.DEFAULTS.FONT_FAMILY};
`

const DarkBackgroundMenu = styled.div`
  background: ${COLORS.SOLID_BLACK};
  opacity: 0.3;
  z-index: 1;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
`

const createUser = () => {
  const parser = new UAParser()
  const ua = parser.getResult()
  let name = `${ua.os.name} ${ua.browser.name}`
  if (ua.device && ua.device.type) name = `${ua.device.type} ${name}`
  return {
    id: uuidv4(),
    name,
  }
}

// eslint-disable-next-line complexity
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
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    toggleWebchat,
    toggleEmojiPicker,
    togglePersistentMenu,
    toggleCoverComponent,
    setError,
    clearMessages,
    openWebviewT,
    closeWebviewT,
    updateLastMessageDate,
    setCurrentAttachment,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.webchatHooks || useWebchat()
  const theme = merge(webchatState.theme, props.theme)
  const { initialSession, initialDevSettings, onStateChange } = props
  const isOnline = useNetwork()
  const getThemeProperty = _getThemeProperty(theme)

  const storage = props.storage === undefined ? localStorage : props.storage
  const storageKey =
    typeof props.storageKey === 'function'
      ? props.storageKey()
      : props.storageKey

  const [botonicState, saveState] = useStorageState(
    storage,
    storageKey || WEBCHAT.DEFAULTS.STORAGE_KEY
  )

  const saveWebchatState = webchatState => {
    storage &&
      saveState(
        JSON.parse(
          stringifyWithRegexs({
            messages: webchatState.messagesJSON,
            session: webchatState.session,
            lastRoutePath: webchatState.lastRoutePath,
            devSettings: webchatState.devSettings,
            lastMessageUpdate: webchatState.lastMessageUpdate,
            themeUpdates: webchatState.themeUpdates, // can contain regexs
          })
        )
      )
  }
  const deviceAdapter = new DeviceAdapter()

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

  const sendUserInput = async input => {
    props.onUserInput &&
      props.onUserInput({
        user: webchatState.session.user,
        input: input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
  }

  const resendUnsentInputs = async () =>
    props.resendUnsentInputs && props.resendUnsentInputs()

  // Load initial state from storage
  useEffect(() => {
    let {
      messages,
      session,
      lastRoutePath,
      devSettings,
      lastMessageUpdate,
      themeUpdates,
    } = botonicState || {}
    if (!session) session = {}
    if (!session.user || Object.keys(session.user).length === 0)
      session.user = createUser()
    updateSession(session)
    if (
      !devSettings ||
      Object.keys(devSettings).length === 0 ||
      devSettings.keepSessionOnReload
    ) {
      if (messages) {
        messages.forEach(m => {
          addMessage(m)
          const newComponent = msgToBotonic(
            { ...m, delay: 0, typing: 0 },
            (props.theme.message && props.theme.message.customTypes) ||
              props.theme.customMessageTypes
          )
          if (newComponent) addMessageComponent(newComponent)
        })
      }
      if (initialSession) updateSession(merge(initialSession, session))
      if (lastRoutePath) updateLastRoutePath(lastRoutePath)
    } else updateSession(merge(initialSession, session))
    if (devSettings) updateDevSettings(devSettings)
    else if (initialDevSettings) updateDevSettings(initialDevSettings)
    if (lastMessageUpdate) updateLastMessageDate(lastMessageUpdate)
    if (themeUpdates !== undefined)
      updateTheme(merge(props.theme, themeUpdates), themeUpdates)
    if (props.onInit) setTimeout(() => props.onInit(), 100)
  }, [])

  useAsyncEffect(async () => {
    if (!webchatState.isWebchatOpen) return
    deviceAdapter.init()
    scrollToBottom({ behavior: 'auto' })
    await resendUnsentInputs()
  }, [webchatState.isWebchatOpen])

  useEffect(() => {
    if (onStateChange && typeof onStateChange === 'function')
      onStateChange(webchatState)
    saveWebchatState(webchatState)
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
  ])

  useAsyncEffect(async () => {
    if (!isOnline) {
      setError({
        message: 'Connection issues',
      })
    } else {
      await resendUnsentInputs()
      setError(undefined)
    }
  }, [isOnline])

  useTyping({ webchatState, updateTyping, updateMessage })

  useEffect(() => {
    updateTheme(merge(props.theme, theme))
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

  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    props.enableAnimations !== undefined ? props.enableAnimations : true
  )
  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    props.persistentMenu
  )

  const darkBackgroundMenu = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.darkBackgroundMenu,
    false
  )

  const getBlockInputs = (rule, inputData) => {
    return rule.match.some(regex => {
      if (typeof regex === 'string') regex = deserializeRegex(regex)
      return regex.test(inputData)
    })
  }

  const checkBlockInput = input => {
    // if is a text we check if it is a serialized RE
    const blockInputs = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.blockInputs,
      props.blockInputs
    )
    if (!Array.isArray(blockInputs)) return false
    for (const rule of blockInputs) {
      if (getBlockInputs(rule, input.data)) {
        addMessageComponent(
          <Text
            id={input.id}
            from={SENDERS.user}
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

  const persistentMenu = () => {
    return (
      <OpenedPersistentMenu
        onClick={closeMenu}
        options={persistentMenuOptions}
        borderRadius={webchatState.theme.style.borderRadius || '10px'}
      />
    )
  }

  const getCoverComponent = () => {
    return getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.coverComponent,
      props.coverComponent &&
        (props.coverComponent.component || props.coverComponent)
    )
  }
  const CoverComponent = getCoverComponent()

  const closeCoverComponent = () => {
    toggleCoverComponent(false)
  }

  useEffect(() => {
    if (!CoverComponent) return
    if (
      !botonicState ||
      (botonicState.messages && botonicState.messages.length == 0)
    )
      toggleCoverComponent(true)
  }, [])

  const coverComponent = () => {
    const coverComponentProps = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.coverComponentProps,
      props.coverComponent && props.coverComponent.props
    )

    if (CoverComponent && webchatState.isCoverComponentOpen)
      return (
        <CoverComponent
          closeComponent={closeCoverComponent}
          {...coverComponentProps}
        />
      )
    return null
  }

  const messageComponentFromInput = input => {
    let messageComponent = null
    if (isText(input)) {
      messageComponent = (
        <Text id={input.id} payload={input.payload} from={SENDERS.user}>
          {input.data}
        </Text>
      )
    } else if (isMedia(input)) {
      const temporaryDisplayUrl = URL.createObjectURL(input.data)
      const mediaProps = {
        id: input.id,
        from: SENDERS.user,
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
    if (isText(input) && (!input.data || !input.data.trim())) return // in case trim() doesn't work in a browser we can use !/\S/.test(input.data)
    if (isText(input) && checkBlockInput(input)) return
    if (!input.id) input.id = uuidv4()
    const messageComponent = messageComponentFromInput(input)
    if (messageComponent) addMessageComponent(messageComponent)
    if (isMedia(input)) input.data = await readDataURL(input.data)
    sendUserInput(input)
    updateLatestInput(input)
    updateLastMessageDate(new Date())
    updateReplies(false)
    togglePersistentMenu(false)
    toggleEmojiPicker(false)
  }

  /* This is the public API this component exposes to its parents
  https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  */

  const updateSessionWithUser = userToUpdate =>
    updateSession(merge(webchatState.session, { user: userToUpdate }))

  useImperativeHandle(ref, () => ({
    addBotResponse: ({ response, session, lastRoutePath }) => {
      updateTyping(false)
      if (Array.isArray(response)) response.map(r => addMessageComponent(r))
      else if (response) addMessageComponent(response)
      if (session) {
        updateSession(merge(session, { user: webchatState.session.user }))
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
    updateUser: updateSessionWithUser,
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openCoverComponent: () => toggleCoverComponent(true),
    closeCoverComponent: () => toggleCoverComponent(false),
    toggleCoverComponent: () =>
      toggleCoverComponent(!webchatState.isCoverComponentOpen),
    openWebviewApi: component => openWebviewT(component),
    setError,
    getMessages: () => webchatState.messagesJSON,
    clearMessages: () => {
      clearMessages()
      updateReplies(false)
    },
    getLastMessageUpdate: () => webchatState.lastMessageUpdate,
    updateMessageInfo: (msgId, messageInfo) => {
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id == msgId
      )[0]
      updateMessage({ ...messageToUpdate, ...messageInfo })
    },
    updateWebchatSettings: settings => {
      const themeUpdates = normalizeWebchatSettings(settings)
      updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates)
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
    const triggerImage = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.triggerButtonImage,
      null
    )
    if (triggerImage === null) {
      webchatState.theme.triggerButtonImage = WEBCHAT.DEFAULTS.LOGO
      return null
    }
    return triggerImage
  }

  const triggerButtonStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.triggerButtonStyle
  )

  const CustomTriggerButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customTrigger,
    undefined
  )

  const triggerButton = () => {
    if (CustomTriggerButton) {
      return <CustomTriggerButton />
    }
    return (
      <StyledTriggerButton
        role='trigger-button'
        style={{ ...triggerButtonStyle }}
      >
        {getTriggerImage() && (
          <TriggerImage src={resolveImage(getTriggerImage())} />
        )}
      </StyledTriggerButton>
    )
  }

  const webchatMessageList = () => (
    <WebchatMessageList style={{ flex: 1 }}>
      {webchatState.typing && <TypingIndicator />}
    </WebchatMessageList>
  )
  const webchatReplies = () => <WebchatReplies replies={webchatState.replies} />

  const isUserInputEnabled = () => {
    const isUserInputEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableUserInput,
      props.enableUserInput !== undefined ? props.enableUserInput : true
    )
    return isUserInputEnabled && !webchatState.isCoverComponentOpen
  }

  const userInputEnabled = isUserInputEnabled()
  const emojiPickerEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableEmojiPicker,
    props.enableEmojiPicker
  )
  const attachmentsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAttachments,
    props.enableAttachments
  )
  const sendButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableSendButton,
    true
  )
  const CustomSendButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customSendButton,
    undefined
  )
  const CustomMenuButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customMenuButton,
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
            ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputStyle),
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
                WEBCHAT.CUSTOM_PROPERTIES.textPlaceholder,
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
                ...getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.userInputBoxStyle
                ),
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
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
          ...mobileStyle,
        }}
        webview={webchatState.webview}
      />
    </RequestContext.Provider>
  )
  let mobileStyle = {}
  if (isMobile(getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileBreakpoint))) {
    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: '100%',
      height: '100%',
      right: 0,
      bottom: 0,
      borderRadius: 0,
    }
  }

  useEffect(() => {
    // Prod mode
    saveWebchatState(webchatState)
    scrollToBottom()
  }, [webchatState.themeUpdates])

  // Only needed for dev/serve mode
  const updateWebchatDevSettings = settings => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const themeUpdates = normalizeWebchatSettings(settings)
      updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates)
    }, [webchatState.messagesJSON])
  }

  const DarkenBackground = ({ component }) => {
    return (
      <div>
        {darkBackgroundMenu && (
          <DarkBackgroundMenu
            style={{
              borderRadius: webchatState.theme.style.borderRadius,
            }}
          />
        )}
        {component}
      </div>
    )
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
        updateUser: updateSessionWithUser,
        updateWebchatDevSettings: updateWebchatDevSettings,
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
          role='styled-webchat'
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
          {webchatState.error.message && (
            <ErrorMessageContainer>
              <ErrorMessage>{webchatState.error.message}</ErrorMessage>
            </ErrorMessageContainer>
          )}
          {webchatMessageList()}
          {webchatState.replies &&
            Object.keys(webchatState.replies).length > 0 &&
            webchatReplies()}
          {webchatState.isPersistentMenuOpen && (
            <DarkenBackground component={persistentMenu()} />
          )}
          {!webchatState.handoff && userInputArea()}
          {webchatState.webview && webchatWebview()}
          {webchatState.isCoverComponentOpen && (
            <DarkenBackground component={coverComponent()} />
          )}
        </StyledWebchat>
      )}
    </WebchatContext.Provider>
  )
})
