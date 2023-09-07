import { Input, Session } from '@botonic/core'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { ThemeProps, Webview } from '../components/index-types'
import { COLORS, WEBCHAT } from '../constants'
import { WebchatMessage } from '../index-types'
import { scrollToBottom } from '../util/dom'
import { WebchatAction } from './actions'
import { DevSettings, ErrorMessage, WebchatState } from './index-types'
import { webchatReducer } from './webchat-reducer'

export const webchatInitialState: WebchatState = {
  width: WEBCHAT.DEFAULTS.WIDTH,
  height: WEBCHAT.DEFAULTS.HEIGHT,
  messagesJSON: [],
  messagesComponents: [],
  replies: [],
  latestInput: {},
  typing: false,
  webview: null,
  webviewParams: null,
  session: { user: undefined },
  lastRoutePath: null,
  handoff: false,
  theme: {
    headerTitle: WEBCHAT.DEFAULTS.TITLE,
    brandColor: COLORS.BOTONIC_BLUE,
    brandImage: WEBCHAT.DEFAULTS.LOGO,
    triggerButtonImage: undefined,
    textPlaceholder: WEBCHAT.DEFAULTS.PLACEHOLDER,
    style: {
      fontFamily: WEBCHAT.DEFAULTS.FONT_FAMILY,
    },
  },
  themeUpdates: {},
  error: {},
  online: true,
  devSettings: { keepSessionOnReload: false },
  isWebchatOpen: false,
  isEmojiPickerOpen: false,
  isPersistentMenuOpen: false,
  isCoverComponentOpen: false,
  isCustomComponentRendered: false,
  lastMessageUpdate: undefined,
  currentAttachment: undefined,
  jwt: undefined,
  unreadMessages: 0,
}

export function useWebchat() {
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    webchatInitialState
  )

  const addMessage = (message: WebchatMessage) =>
    webchatDispatch({ type: WebchatAction.ADD_MESSAGE, payload: message })

  const addMessageComponent = (message: WebchatMessage) =>
    webchatDispatch({
      type: WebchatAction.ADD_MESSAGE_COMPONENT,
      payload: message,
    })

  const updateMessage = (message: WebchatMessage) =>
    webchatDispatch({ type: WebchatAction.UPDATE_MESSAGE, payload: message })

  const updateReplies = replies =>
    webchatDispatch({ type: WebchatAction.UPDATE_REPLIES, payload: replies })

  const updateLatestInput = (input: Input) =>
    webchatDispatch({ type: WebchatAction.UPDATE_LATEST_INPUT, payload: input })

  const updateTyping = (typing: boolean) =>
    webchatDispatch({ type: WebchatAction.UPDATE_TYPING, payload: typing })

  const updateWebview = (webview: Webview, params: Record<string, string>) =>
    webchatDispatch({
      type: WebchatAction.UPDATE_WEBVIEW,
      payload: { webview, webviewParams: params },
    })

  const updateSession = (session: Session) => {
    webchatDispatch({
      type: WebchatAction.UPDATE_SESSION,
      payload: session,
    })
  }

  const updateLastRoutePath = (path: string) =>
    webchatDispatch({
      type: WebchatAction.UPDATE_LAST_ROUTE_PATH,
      payload: path,
    })

  const updateHandoff = (handoff: boolean) =>
    webchatDispatch({
      type: WebchatAction.UPDATE_HANDOFF,
      payload: handoff,
    })

  const updateTheme = (theme: ThemeProps, themeUpdates?: ThemeProps) => {
    const payload =
      themeUpdates !== undefined ? { theme, themeUpdates } : { theme }
    webchatDispatch({
      type: WebchatAction.UPDATE_THEME,
      payload,
    })
  }

  const updateDevSettings = (settings: DevSettings) =>
    webchatDispatch({
      type: WebchatAction.UPDATE_DEV_SETTINGS,
      payload: settings,
    })

  const toggleWebchat = (toggle: boolean) => {
    webchatDispatch({
      type: WebchatAction.TOGGLE_WEBCHAT,
      payload: toggle,
    })
  }

  const toggleEmojiPicker = (toggle: boolean) =>
    webchatDispatch({
      type: WebchatAction.TOGGLE_EMOJI_PICKER,
      payload: toggle,
    })

  const togglePersistentMenu = (toggle: boolean) =>
    webchatDispatch({
      type: WebchatAction.TOGGLE_PERSISTENT_MENU,
      payload: toggle,
    })

  const toggleCoverComponent = (toggle: boolean) =>
    webchatDispatch({
      type: WebchatAction.TOGGLE_COVER_COMPONENT,
      payload: toggle,
    })

  const doRenderCustomComponent = (toggle: boolean) =>
    webchatDispatch({
      type: WebchatAction.DO_RENDER_CUSTOM_COMPONENT,
      payload: toggle,
    })

  const setError = (error: ErrorMessage) =>
    webchatDispatch({
      type: WebchatAction.SET_ERROR,
      payload: error,
    })

  const setOnline = (online: boolean) =>
    webchatDispatch({
      type: WebchatAction.SET_ONLINE,
      payload: online,
    })

  const clearMessages = () => {
    webchatDispatch({
      type: WebchatAction.CLEAR_MESSAGES,
    })
  }

  const updateLastMessageDate = (date: string) => {
    webchatDispatch({
      type: WebchatAction.UPDATE_LAST_MESSAGE_DATE,
      payload: date,
    })
  }

  const setCurrentAttachment = (attachment: File) => {
    webchatDispatch({
      type: WebchatAction.SET_CURRENT_ATTACHMENT,
      payload: attachment,
    })
  }

  const updateJwt = (jwt: string) => {
    webchatDispatch({
      type: WebchatAction.UPDATE_JWT,
      payload: jwt,
    })
  }

  return {
    addMessage,
    addMessageComponent,
    clearMessages,
    doRenderCustomComponent,
    setCurrentAttachment,
    setError,
    setOnline,
    toggleCoverComponent,
    toggleEmojiPicker,
    togglePersistentMenu,
    toggleWebchat,
    updateDevSettings,
    updateHandoff,
    updateJwt,
    updateLastMessageDate,
    updateLastRoutePath,
    updateLatestInput,
    updateMessage,
    updateReplies,
    updateSession,
    updateTheme,
    updateTyping,
    updateWebview,
    webchatDispatch,
    webchatState,
  }
}
interface UseTyping {
  webchatState: WebchatState
  updateTyping: (typing: boolean) => void
  updateMessage: (message: WebchatMessage) => void
  host: any
}

export function useTyping({
  webchatState,
  updateTyping,
  updateMessage,
  host,
}: UseTyping): void {
  useEffect(() => {
    let delayTimeout, typingTimeout
    scrollToBottom({ host })
    try {
      const nextMsg = webchatState.messagesJSON.filter(m => !m.display)[0]
      if (nextMsg.delay && nextMsg.typing) {
        delayTimeout = setTimeout(
          () => updateTyping(true),
          nextMsg.delay * 1000
        )
      } else if (nextMsg.typing) updateTyping(true)
      const totalDelay = nextMsg.delay + nextMsg.typing
      if (totalDelay)
        typingTimeout = setTimeout(() => {
          updateMessage({ ...nextMsg, display: true })
          updateTyping(false)
        }, totalDelay * 1000)
    } catch (e) {}
    return () => {
      clearTimeout(delayTimeout)
      clearTimeout(typingTimeout)
    }
  }, [webchatState.messagesJSON, webchatState.typing])
}

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

interface ComponentVisible {
  ref: React.RefObject<HTMLElement>
  isComponentVisible: boolean
  setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function useComponentVisible(
  initialIsVisible: boolean,
  onClickOutside: () => void
): ComponentVisible {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef<HTMLElement>(null)
  const handleClickOutside = event => {
    const target = event.path ? event.path[0] : event.target
    if (ref.current && !ref.current.contains(target)) {
      setIsComponentVisible(false)
      onClickOutside()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  })
  return { ref, isComponentVisible, setIsComponentVisible }
}

export const useComponentWillMount = func => {
  useMemo(func, [])
}
