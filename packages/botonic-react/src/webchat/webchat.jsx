import { INPUT, isMobile, params2queryString } from '@botonic/core'
import merge from 'lodash.merge'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Textarea from 'react-textarea-autosize'
import styled, { StyleSheetManager } from 'styled-components'
import { useAsyncEffect } from 'use-async-effect'
import { v4 as uuidv4 } from 'uuid'

import { Audio, Document, Image, Text, Video } from '../components'
import { Handoff } from '../components/handoff'
import { normalizeWebchatSettings } from '../components/webchat-settings'
import { COLORS, MAX_ALLOWED_SIZE_MB, ROLES, WEBCHAT } from '../constants'
import { WebchatContext, WebviewRequestContext } from '../contexts'
import { SENDERS } from '../index-types'
import {
  getFullMimeWhitelist,
  getMediaType,
  isAllowedSize,
  isAudio,
  isDocument,
  isImage,
  isMedia,
  isText,
  isVideo,
  readDataURL,
} from '../message-utils'
import { msgToBotonic } from '../msg-to-botonic'
import { scrollToBottom } from '../util/dom'
import { isDev } from '../util/environment'
import { deserializeRegex, stringifyWithRegexs } from '../util/regexs'
import {
  _getThemeProperty,
  getServerErrorMessage,
  initSession,
  shouldKeepSessionOnReload,
} from '../util/webchat'
import { Attachment } from './components/attachment'
import { EmojiPicker, OpenedEmojiPicker } from './components/emoji-picker'
import {
  OpenedPersistentMenu,
  PersistentMenu,
} from './components/persistent-menu'
import { SendButton } from './components/send-button'
import { DeviceAdapter } from './devices/device-adapter'
import { StyledWebchatHeader } from './header'
import {
  useComponentWillMount,
  usePrevious,
  useTyping,
  useWebchat,
} from './hooks'
import { WebchatMessageList } from './message-list'
import { WebchatReplies } from './replies'
import { TriggerButton } from './trigger-button'
import { useStorageState } from './use-storage-state-hook'
import { WebviewContainer } from './webview'

export const getParsedAction = botonicAction => {
  const splittedAction = botonicAction.split('create_case:')
  if (splittedAction.length <= 1) return undefined
  return JSON.parse(splittedAction[1])
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

const UserInputContainer = styled.div`
  min-height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 0px 16px;
  z-index: 1;
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_5};
`

const TextAreaContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
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

// eslint-disable-next-line complexity, react/display-name
export const Webchat = forwardRef((props, ref) => {
  const {
    addMessage,
    addMessageComponent,
    clearMessages,
    doRenderCustomComponent,
    openWebviewT,
    resetUnreadMessages,
    setCurrentAttachment,
    setError,
    setLastMessageVisible,
    setOnline,
    toggleCoverComponent,
    toggleEmojiPicker,
    togglePersistentMenu,
    toggleWebchat,
    updateDevSettings,
    updateHandoff,
    updateLastMessageDate,
    updateLastRoutePath,
    updateLatestInput,
    updateMessage,
    updateReplies,
    updateSession,
    updateTheme,
    updateTyping,
    updateWebview,
    webchatState,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.webchatHooks || useWebchat()
  const firstUpdate = useRef(true)
  const isOnline = () => webchatState.online
  const currentDateString = () => new Date().toISOString()
  const theme = merge(webchatState.theme, props.theme)
  const { initialSession, initialDevSettings, onStateChange } = props
  const getThemeProperty = _getThemeProperty(theme)

  const [customComponent, setCustomComponent] = useState(null)
  const storage = props.storage
  const storageKey =
    typeof props.storageKey === 'function'
      ? props.storageKey()
      : props.storageKey

  const [botonicState, saveState] = useStorageState(storage, storageKey)

  const host = props.host || document.body

  const deviceAdapter = new DeviceAdapter()

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
            themeUpdates: webchatState.themeUpdates,
          })
        )
      )
  }

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
    if (props.onUserInput) {
      resetUnreadMessages()
      scrollToBottom({ host })
      props.onUserInput({
        user: webchatState.session.user,
        input: input,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
    }
  }

  const sendChatEvent = async chatEvent => {
    const chatEventInput = {
      id: uuidv4(),
      type: INPUT.CHAT_EVENT,
      data: chatEvent,
    }
    props.onUserInput &&
      props.onUserInput({
        user: webchatState.session.user,
        input: chatEventInput,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
      })
  }

  // Load styles stored in window._botonicInsertStyles by Webpack
  useComponentWillMount(() => {
    if (window._botonicInsertStyles && window._botonicInsertStyles.length) {
      for (const botonicStyle of window._botonicInsertStyles) {
        // Injecting styles at head is needed even if we use shadowDOM
        // as some dependencies like simplebar rely on creating ephemeral elements
        // on document.body and assume styles will be available globally
        document.head.appendChild(botonicStyle)

        // injecting styles in host node too so that shadowDOM works
        if (props.shadowDOM) host.appendChild(botonicStyle.cloneNode(true))
      }
      delete window._botonicInsertStyles
    }

    if (props.shadowDOM) {
      // emoji-picker-react injects styles in head, so we need to
      // re-inject them in our host node to make it work with shadowDOM
      for (const style of document.querySelectorAll('style')) {
        if (
          style.textContent &&
          style.textContent.includes('emoji-picker-react')
        )
          host.appendChild(style.cloneNode(true))
      }
    }
  })

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
    session = initSession(session)
    updateSession(session)
    if (shouldKeepSessionOnReload({ initialDevSettings, devSettings })) {
      if (messages) {
        messages.forEach(message => {
          addMessage(message)
          const newMessageComponent = msgToBotonic(
            { ...message, delay: 0, typing: 0 },
            (props.theme.message && props.theme.message.customTypes) ||
              props.theme.customMessageTypes
          )
          if (newMessageComponent) addMessageComponent(newMessageComponent)
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

  useEffect(() => {
    if (!webchatState.isWebchatOpen) {
      if (webchatState.isLastMessageVisible) {
        resetUnreadMessages()
      }
      return
    }
    deviceAdapter.init(host)
  }, [webchatState.isWebchatOpen])

  useEffect(() => {
    if (onStateChange && typeof onStateChange === 'function') {
      onStateChange(webchatState)
    }
    saveWebchatState(webchatState)
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
  ])

  useAsyncEffect(async () => {
    if (!webchatState.online) {
      setError({
        message: getServerErrorMessage(props.server),
      })
    } else {
      if (!firstUpdate.current) {
        setError(undefined)
      }
    }
  }, [webchatState.online])

  useTyping({ webchatState, updateTyping, updateMessage, host })

  useEffect(() => {
    updateTheme(merge(props.theme, theme, webchatState.themeUpdates))
  }, [props.theme, webchatState.themeUpdates])

  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params)

  const handleSelectedEmoji = event => {
    textArea.current.value += event.emoji
    textArea.current.focus()
  }

  const closeWebview = options => {
    updateWebview()
    if (userInputEnabled) {
      textArea.current.focus()
    }
    if (options?.payload) {
      sendPayload(options.payload)
    } else if (options?.path) {
      const params = options.params ? params2queryString(options.params) : ''
      sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
    }
  }

  const handleMenu = () => {
    togglePersistentMenu(!webchatState.isPersistentMenuOpen)
  }

  const handleEmojiClick = () => {
    toggleEmojiPicker(!webchatState.isEmojiPickerOpen)
  }

  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    props.persistentMenu
  )

  const darkBackgroundMenu = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.darkBackgroundMenu,
    false
  )

  const getBlockInputs = (rule, inputData) => {
    const processedInput = rule.preprocess
      ? rule.preprocess(inputData)
      : inputData

    return rule.match.some(regex => {
      if (typeof regex === 'string') regex = deserializeRegex(regex)
      return regex.test(processedInput)
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
            sentBy={SENDERS.user}
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
        <Text id={input.id} payload={input.payload} sentBy={SENDERS.user}>
          {input.data}
        </Text>
      )
    } else if (isMedia(input)) {
      const temporaryDisplayUrl = URL.createObjectURL(input.data)
      const mediaProps = {
        id: input.id,
        sentBy: SENDERS.user,
        src: temporaryDisplayUrl,
      }
      if (isImage(input)) {
        mediaProps.input = input
        messageComponent = <Image {...mediaProps} />
      } else if (isAudio(input)) messageComponent = <Audio {...mediaProps} />
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
    isOnline() && updateLastMessageDate(currentDateString())
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

      const isUnread =
        !webchatState.isLastMessageVisible || webchatState.numUnreadMessages > 0

      if (Array.isArray(response)) {
        response.forEach(r => {
          addMessageComponent({ ...r, props: { ...r.props, isUnread } })
        })
      } else if (response) {
        addMessageComponent({
          ...response,
          props: { ...response.props, isUnread },
        })
      }

      if (session) {
        updateSession(merge(session, { user: webchatState.session.user }))
        const action = session._botonic_action || ''
        const handoff = action.startsWith('create_case')
        if (handoff && isDev) addMessageComponent(<Handoff />)
        updateHandoff(handoff)
      }

      if (lastRoutePath) updateLastRoutePath(lastRoutePath)

      updateLastMessageDate(currentDateString())
    },
    setTyping: typing => updateTyping(typing),
    addUserMessage: message => sendInput(message),
    updateUser: updateSessionWithUser,
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openCoverComponent: () => toggleCoverComponent(true),
    closeCoverComponent: () => toggleCoverComponent(false),
    renderCustomComponent: _customComponent => {
      setCustomComponent(_customComponent)
      doRenderCustomComponent(true)
    },
    unmountCustomComponent: () => doRenderCustomComponent(false),
    toggleCoverComponent: () =>
      toggleCoverComponent(!webchatState.isCoverComponentOpen),
    openWebviewApi: component => openWebviewT(component),
    setError,
    setOnline,
    getMessages: () => webchatState.messagesJSON,
    isOnline,
    clearMessages: () => {
      clearMessages()
      updateReplies(false)
    },
    getLastMessageUpdate: () => webchatState.lastMessageUpdate,
    updateMessageInfo: (msgId, messageInfo) => {
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id == msgId
      )[0]
      const updatedMsg = merge(messageToUpdate, messageInfo)
      if (updatedMsg.ack === 1) delete updatedMsg.unsentInput
      updateMessage(updatedMsg)
    },
    updateWebchatSettings: settings => {
      if (settings.user) {
        updateSessionWithUser(settings.user)
      }
      const themeUpdates = normalizeWebchatSettings(settings)
      updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates)
      updateTyping(false)
    },
    closeWebview: closeWebview,
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

  let isTyping = false
  let typingTimeout = null

  function clearTimeoutWithReset(reset) {
    const waitTime = 20 * 1000
    if (typingTimeout) clearTimeout(typingTimeout)
    if (reset) typingTimeout = setTimeout(stopTyping, waitTime)
  }

  function startTyping() {
    isTyping = true
    sendChatEvent('typing_on')
  }

  function stopTyping() {
    clearTimeoutWithReset(false)
    isTyping = false
    sendChatEvent('typing_off')
  }

  const onKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault()
      sendTextAreaText()
      stopTyping()
    }
  }

  const onKeyUp = () => {
    if (textArea.current.value === '') {
      stopTyping()
      return
    }
    if (!isTyping) {
      startTyping()
    }
    clearTimeoutWithReset(true)
  }

  const webviewRequestContext = {
    closeWebview: closeWebview,
    getString: stringId => props.getString(stringId, webchatState.session),
    params: webchatState.webviewParams || {},
    session: webchatState.session || {},
  }

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    if (webchatState.isWebchatOpen && props.onOpen) props.onOpen()

    if (!webchatState.isWebchatOpen && props.onClose && !firstUpdate.current) {
      props.onClose()
      toggleEmojiPicker(false)
      togglePersistentMenu(false)
    }
  }, [webchatState.isWebchatOpen])

  const isUserInputEnabled = () => {
    const isUserInputEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableUserInput,
      props.enableUserInput !== undefined ? props.enableUserInput : true
    )
    return isUserInputEnabled && !webchatState.isCoverComponentOpen
  }

  const userInputEnabled = isUserInputEnabled()

  const textArea = useRef(null)
  const userInputArea = () => {
    return (
      userInputEnabled && (
        <UserInputContainer
          style={{
            ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.userInputStyle),
          }}
          className='user-input-container'
        >
          {webchatState.isEmojiPickerOpen && (
            <OpenedEmojiPicker
              height={webchatState.theme.style.height}
              onEmojiClick={handleSelectedEmoji}
              onClick={handleEmojiClick}
            />
          )}

          <PersistentMenu
            onClick={handleMenu}
            persistentMenu={props.persistentMenu}
          />

          <TextAreaContainer>
            <Textarea
              inputRef={textArea}
              name='text'
              onFocus={() => {
                deviceAdapter.onFocus(host)
              }}
              onBlur={() => {
                deviceAdapter.onBlur()
              }}
              maxRows={4}
              wrap='soft'
              maxLength='1000'
              placeholder={getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.textPlaceholder,
                WEBCHAT.DEFAULTS.PLACEHOLDER
              )}
              autoFocus={false}
              onKeyDown={e => onKeyDown(e)}
              onKeyUp={onKeyUp}
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

          <EmojiPicker
            enableEmojiPicker={props.enableEmojiPicker}
            onClick={handleEmojiClick}
          />

          <Attachment
            enableAttachments={props.enableAttachments}
            onChange={handleAttachment}
            accept={getFullMimeWhitelist().join(',')}
          />

          <SendButton onClick={sendTextAreaText} />
        </UserInputContainer>
      )
    )
  }

  const webchatWebview = () => (
    <WebviewRequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
          ...mobileStyle,
        }}
        webview={webchatState.webview}
      />
    </WebviewRequestContext.Provider>
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

  const _renderCustomComponent = () => {
    if (!customComponent) return <></>
    else return customComponent
  }

  const WebchatComponent = (
    <WebchatContext.Provider
      value={{
        addMessage,
        getThemeProperty,
        openWebview,
        resolveCase,
        resetUnreadMessages,
        setLastMessageVisible,
        sendAttachment,
        sendInput,
        sendPayload,
        sendText,
        toggleWebchat,
        updateLatestInput,
        updateMessage,
        updateReplies,
        updateUser: updateSessionWithUser,
        updateWebchatDevSettings: updateWebchatDevSettings,
        webchatState,
      }}
    >
      {!webchatState.isWebchatOpen && <TriggerButton />}

      {webchatState.isWebchatOpen && (
        <StyledWebchat
          // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          role={ROLES.WEBCHAT}
          id={WEBCHAT.DEFAULTS.ID}
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

          <WebchatMessageList style={{ flex: 1 }} host={host} />

          {webchatState.replies &&
            Object.keys(webchatState.replies).length > 0 && (
              <WebchatReplies replies={webchatState.replies} />
            )}

          {webchatState.isPersistentMenuOpen && (
            <DarkenBackground component={persistentMenu()} />
          )}
          {!webchatState.handoff && userInputArea()}
          {webchatState.webview && webchatWebview()}
          {webchatState.isCoverComponentOpen && coverComponent()}
          {webchatState.isCustomComponentRendered &&
            customComponent &&
            _renderCustomComponent()}
        </StyledWebchat>
      )}
    </WebchatContext.Provider>
  )
  return props.shadowDOM ? (
    <StyleSheetManager target={host}>{WebchatComponent}</StyleSheetManager>
  ) : (
    WebchatComponent
  )
})
