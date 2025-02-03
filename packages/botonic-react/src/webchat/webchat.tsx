import {
  BotonicAction,
  INPUT,
  isMobile,
  params2queryString,
} from '@botonic/core'
import merge from 'lodash.merge'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { StyleSheetManager } from 'styled-components'
import { v7 as uuidv7 } from 'uuid'

import {
  Audio,
  Document,
  Handoff,
  Image,
  normalizeWebchatSettings,
  Text,
  Video,
  WebchatSettingsProps,
} from '../components'
import { COLORS, MAX_ALLOWED_SIZE_MB, ROLES, WEBCHAT } from '../constants'
import { CloseWebviewOptions } from '../contexts'
import { SENDERS, WebchatProps, WebchatRef } from '../index-types'
import {
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
import { isDev } from '../util/environment'
import { deserializeRegex, stringifyWithRegexs } from '../util/regexs'
import {
  _getThemeProperty,
  getServerErrorMessage,
  initSession,
  shouldKeepSessionOnReload,
} from '../util/webchat'
import { ChatArea } from './chat-area'
import { OpenedPersistentMenu } from './components/opened-persistent-menu'
import { BotonicContainerId } from './constants'
import { useWebchat, WebchatContext, WebchatState } from './context'
import { CoverComponent } from './cover-component'
import { WebchatHeader } from './header'
import {
  useComponentWillMount,
  usePrevious,
  useScrollToBottom,
  useTyping,
} from './hooks'
import { InputPanel } from './input-panel'
import {
  DarkBackgroundMenu,
  ErrorMessage,
  ErrorMessageContainer,
  StyledWebchat,
} from './styles'
import { TriggerButton } from './trigger-button'
import { useStorageState } from './use-storage-state-hook'
import { getParsedAction } from './utils'
import { WebviewContainer } from './webview/index'

// eslint-disable-next-line complexity, react/display-name
const Webchat = forwardRef<WebchatRef | null, WebchatProps>((props, ref) => {
  const {
    addMessage,
    addMessageComponent,
    clearMessages,
    doRenderCustomComponent,
    resetUnreadMessages,
    setCurrentAttachment,
    setError,
    setIsInputFocused,
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
    removeWebview,
    removeReplies,
    webchatState,
    webchatContainerRef,
    chatAreaRef,
    inputPanelRef,
    headerRef,
    repliesRef,
    scrollableMessagesListRef,
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

  const { scrollToBottom } = useScrollToBottom({ host })

  const saveWebchatState = (webchatState: WebchatState) => {
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

  const handleAttachment = (event: any) => {
    if (!isAllowedSize(event.target.files[0].size)) {
      throw new Error(
        `The file is too large. A maximum of ${MAX_ALLOWED_SIZE_MB}MB is allowed.`
      )
    }

    // TODO: Attach more files?
    setCurrentAttachment(event.target.files[0])
  }

  useEffect(() => {
    if (webchatState.currentAttachment) {
      sendAttachment(webchatState.currentAttachment)
    }
  }, [webchatState.currentAttachment])

  const sendUserInput = async (input: any) => {
    if (props.onUserInput) {
      resetUnreadMessages()
      scrollToBottom()
      props.onUserInput({
        user: webchatState.session.user,
        // TODO: Review if this input.sentBy exists in the frontend
        input: input,
        //@ts-ignore
        session: webchatState.session,
        // TODO: Review why we were passing lastRoutePath, is only for devMode?
        lastRoutePath: webchatState.lastRoutePath,
      })
    }
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
            props.theme?.message?.customTypes || props.theme?.customMessageTypes
          )
          //@ts-ignore
          if (newMessageComponent) addMessageComponent(newMessageComponent)
        })
      }
      if (initialSession) updateSession(merge(initialSession, session))
      if (lastRoutePath) updateLastRoutePath(lastRoutePath)
    } else updateSession(merge(initialSession, session))
    if (devSettings) updateDevSettings(devSettings)
    else if (initialDevSettings) updateDevSettings(initialDevSettings)

    if (lastMessageUpdate) {
      updateLastMessageDate(lastMessageUpdate)
    }

    if (themeUpdates !== undefined) {
      updateTheme(merge(props.theme, themeUpdates), themeUpdates)
    }

    if (props.onInit) {
      setTimeout(() => props.onInit && props.onInit(), 100)
    }
  }, [])

  useEffect(() => {
    if (!webchatState.isWebchatOpen) {
      if (webchatState.isLastMessageVisible) {
        resetUnreadMessages()
      }
      return
    }
  }, [webchatState.isWebchatOpen])

  useEffect(() => {
    const { messagesJSON, session } = webchatState
    if (onStateChange && typeof onStateChange === 'function' && session.user) {
      onStateChange({ messagesJSON, user: session.user })
    }
    saveWebchatState(webchatState)
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
  ])

  useEffect(() => {
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

  const openWebview = (webviewComponent, params) => {
    updateWebview(webviewComponent, params)
  }

  const textareaRef = useRef<HTMLTextAreaElement | undefined>()

  const closeWebview = async (options?: CloseWebviewOptions) => {
    removeWebview()
    if (userInputEnabled) {
      textareaRef.current?.focus()
    }
    if (options?.payload) {
      await sendPayload(options.payload)
    } else if (options?.path) {
      const params = options.params ? params2queryString(options.params) : ''
      await sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
    }
  }

  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    props.persistentMenu
  )

  const darkBackgroundMenu = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.darkBackgroundMenu
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
            // Is necessary to add the id of the input
            // to keep the input.id generated in the frontend as id of the message
            // @ts-ignore
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
        removeReplies()
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
  const coverComponent = getCoverComponent()
  const coverComponentProps = props.coverComponent?.props

  useEffect(() => {
    if (!coverComponent) return
    if (
      !botonicState ||
      (botonicState.messages && botonicState.messages.length === 0)
    )
      toggleCoverComponent(true)
  }, [])

  const messageComponentFromInput = input => {
    let messageComponent: any = null
    if (isText(input)) {
      messageComponent = (
        <Text
          // Is necessary to add the id of the input
          // to keep the input.id generated in the frontend as id of the message
          // @ts-ignore
          id={input.id}
          // Is necessary to add the payload of the input when user clicks a button
          // @ts-ignore
          payload={input.payload}
          sentBy={SENDERS.user}
        >
          {input.data}
        </Text>
      )
    } else if (isMedia(input)) {
      const temporaryDisplayUrl = URL.createObjectURL(input.data)
      // TODO: We sould use URL.revokeObjectURL(temporaryDisplayUrl) when the component is unmounted
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
      const mediaProps: {
        id: string
        sentBy: SENDERS
        src: string
        input?: any
      } = {
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

  const sendInput = async (input: any) => {
    if (!input || Object.keys(input).length == 0) return
    if (isText(input) && (!input.data || !input.data.trim())) return // in case trim() doesn't work in a browser we can use !/\S/.test(input.data)
    if (isText(input) && checkBlockInput(input)) return
    if (!input.id) input.id = uuidv7()
    const messageComponent = messageComponentFromInput(input)
    if (messageComponent) addMessageComponent(messageComponent)
    if (isMedia(input)) input.data = await readDataURL(input.data)
    sendUserInput(input)
    updateLatestInput(input)
    isOnline() && updateLastMessageDate(currentDateString())
    removeReplies()
    togglePersistentMenu(false)
    toggleEmojiPicker(false)
  }

  /* This is the public API this component exposes to its parents
  https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  */

  const updateSessionWithUser = (userToUpdate: any) =>
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
        const handoff = action.startsWith(BotonicAction.CreateCase)
        if (handoff && isDev) addMessageComponent(<Handoff />)
        updateHandoff(handoff)
      }

      if (lastRoutePath) updateLastRoutePath(lastRoutePath)

      updateLastMessageDate(currentDateString())
    },
    setTyping: (typing: boolean) => updateTyping(typing),
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
    setOnline,
    getMessages: () => webchatState.messagesJSON,
    isOnline,
    clearMessages: () => {
      clearMessages()
      removeReplies()
    },
    getLastMessageUpdate: () => webchatState.lastMessageUpdate,
    updateMessageInfo: (msgId: string, messageInfo: any) => {
      const messageToUpdate = webchatState.messagesJSON.filter(
        m => m.id === msgId
      )[0]
      const updatedMsg = merge(messageToUpdate, messageInfo)
      if (updatedMsg.ack === 1) delete updatedMsg.unsentInput
      updateMessage(updatedMsg)
    },
    updateWebchatSettings: (settings: WebchatSettingsProps) => {
      if (settings.user) {
        updateSessionWithUser(settings.user)
      }
      const themeUpdates = normalizeWebchatSettings(settings)
      updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates)
      updateTyping(false)
    },
    closeWebview: async (options?: CloseWebviewOptions) =>
      closeWebview(options),
  }))

  const resolveCase = () => {
    updateHandoff(false)
    updateSession({ ...webchatState.session, _botonic_action: undefined })
  }

  const prevSession = usePrevious(webchatState.session)
  useEffect(() => {
    // Resume conversation after handoff
    if (prevSession?._botonic_action && !webchatState.session._botonic_action) {
      const action = getParsedAction(prevSession._botonic_action)
      if (action?.on_finish) sendPayload(action.on_finish)
    }
  }, [webchatState.session._botonic_action])

  const sendText = async (text: string, payload?: string) => {
    if (!text) return
    const input = { type: INPUT.TEXT, data: text, payload }
    await sendInput(input)
  }

  const sendPayload = async (payload: string) => {
    if (!payload) return
    const input = { type: INPUT.POSTBACK, payload }
    await sendInput(input)
  }

  const sendAttachment = async (attachment: File) => {
    if (attachment) {
      const attachmentType = getMediaType(attachment.type)
      if (!attachmentType) return
      const input = {
        type: attachmentType,
        data: attachment,
      }
      await sendInput(input)
      setCurrentAttachment()
    }
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

  // TODO: Create a default theme that include mobileStyle
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
        closeWebview,
        openWebview,
        resolveCase,
        resetUnreadMessages,
        setIsInputFocused,
        setLastMessageVisible,
        sendAttachment,
        sendInput,
        sendPayload,
        sendText,
        toggleWebchat,
        toggleEmojiPicker,
        togglePersistentMenu,
        toggleCoverComponent,
        updateLatestInput,
        updateMessage,
        updateReplies,
        updateUser: updateSessionWithUser,
        updateWebchatDevSettings: updateWebchatDevSettings,
        trackEvent: props.onTrackEvent,
        webchatState,
        // TODO: Review if need theme inside Context, already exist inside webchatState
        theme,
        webchatContainerRef,
        chatAreaRef,
        inputPanelRef,
        headerRef,
        repliesRef,
        scrollableMessagesListRef,
      }}
    >
      {!webchatState.isWebchatOpen && <TriggerButton />}

      {webchatState.isWebchatOpen && (
        <StyledWebchat
          id={BotonicContainerId.Webchat}
          ref={webchatContainerRef}
          // TODO: Distinguish between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          role={ROLES.WEBCHAT}
          width={webchatState.width}
          height={webchatState.height}
          style={{
            ...webchatState.theme.style,
            ...mobileStyle,
          }}
        >
          <WebchatHeader ref={headerRef} />

          {webchatState.isCoverComponentOpen ? (
            <CoverComponent
              component={coverComponent}
              componentProps={coverComponentProps}
            />
          ) : (
            <>
              {webchatState.error.message && (
                <ErrorMessageContainer>
                  <ErrorMessage>{webchatState.error.message}</ErrorMessage>
                </ErrorMessageContainer>
              )}

              <ChatArea />

              {webchatState.isPersistentMenuOpen && (
                <DarkenBackground component={persistentMenu()} />
              )}

              {!webchatState.handoff && userInputEnabled && (
                <InputPanel
                  persistentMenu={props.persistentMenu}
                  enableEmojiPicker={props.enableEmojiPicker}
                  enableAttachments={props.enableAttachments}
                  handleAttachment={handleAttachment}
                  textareaRef={textareaRef}
                  host={host}
                  onUserInput={props.onUserInput}
                />
              )}

              {webchatState.webview && <WebviewContainer />}

              {webchatState.isCustomComponentRendered &&
                customComponent &&
                _renderCustomComponent()}
            </>
          )}
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

Webchat.displayName = 'Webchat'
export { Webchat }
