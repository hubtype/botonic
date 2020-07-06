import { useEffect, useReducer, useRef, useState } from 'react'
import { COLORS, WEBCHAT } from '../constants'
import { scrollToBottom } from '../utils'
import { webchatReducer } from './webchat-reducer'
import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_LATEST_INPUT,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
  UPDATE_SESSION,
  UPDATE_USER,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_HANDOFF,
  UPDATE_THEME,
  UPDATE_DEV_SETTINGS,
  TOGGLE_WEBCHAT,
  TOGGLE_EMOJI_PICKER,
  TOGGLE_PERSISTENT_MENU,
  TOGGLE_COVER_COMPONENT,
  SET_ERROR,
  CLEAR_MESSAGES,
  UPDATE_LAST_MESSAGE_DATE,
  SET_CURRENT_ATTACHMENT,
} from './actions'

export const webchatInitialState = {
  width: WEBCHAT.DEFAULTS.WIDTH,
  height: WEBCHAT.DEFAULTS.HEIGHT,
  messagesJSON: [],
  messagesComponents: [],
  replies: [],
  latestInput: {},
  typing: false,
  webview: null,
  webviewParams: null,
  session: {},
  user: null,
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
  error: {},
  devSettings: {},
  isWebchatOpen: false,
  isEmojiPickerOpen: false,
  isPersistentMenuOpen: false,
  isCoverComponent: false,
  lastMessageUpdate: undefined,
  currentAttachment: undefined,
}

export function useWebchat() {
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    webchatInitialState
  )

  const addMessage = message =>
    webchatDispatch({ type: ADD_MESSAGE, payload: message })
  const addMessageComponent = message =>
    webchatDispatch({ type: ADD_MESSAGE_COMPONENT, payload: message })
  const updateMessage = message =>
    webchatDispatch({ type: UPDATE_MESSAGE, payload: message })
  const updateReplies = replies =>
    webchatDispatch({ type: UPDATE_REPLIES, payload: replies })
  const updateLatestInput = input =>
    webchatDispatch({ type: UPDATE_LATEST_INPUT, payload: input })
  const updateTyping = typing =>
    webchatDispatch({ type: UPDATE_TYPING, payload: typing })
  const updateWebview = (webview, params) =>
    webchatDispatch({
      type: UPDATE_WEBVIEW,
      payload: { webview, webviewParams: params },
    })
  const updateSession = session =>
    webchatDispatch({
      type: UPDATE_SESSION,
      payload: session,
    })
  const updateUser = user =>
    webchatDispatch({
      type: UPDATE_USER,
      payload: user,
    })
  const updateLastRoutePath = path =>
    webchatDispatch({
      type: UPDATE_LAST_ROUTE_PATH,
      payload: path,
    })
  const updateHandoff = handoff =>
    webchatDispatch({
      type: UPDATE_HANDOFF,
      payload: handoff,
    })
  const updateTheme = (theme, themeUpdates = undefined) => {
    const payload =
      themeUpdates !== undefined ? { theme, themeUpdates } : { theme }
    webchatDispatch({
      type: UPDATE_THEME,
      payload,
    })
  }
  const updateDevSettings = settings =>
    webchatDispatch({
      type: UPDATE_DEV_SETTINGS,
      payload: settings,
    })
  const toggleWebchat = toggle =>
    webchatDispatch({
      type: TOGGLE_WEBCHAT,
      payload: toggle,
    })
  const toggleEmojiPicker = toggle =>
    webchatDispatch({
      type: TOGGLE_EMOJI_PICKER,
      payload: toggle,
    })
  const togglePersistentMenu = toggle =>
    webchatDispatch({
      type: TOGGLE_PERSISTENT_MENU,
      payload: toggle,
    })
  const toggleCoverComponent = toggle =>
    webchatDispatch({
      type: TOGGLE_COVER_COMPONENT,
      payload: toggle,
    })
  const setError = error =>
    webchatDispatch({
      type: SET_ERROR,
      payload: error,
    })

  const clearMessages = () => {
    webchatDispatch({
      type: CLEAR_MESSAGES,
    })
  }
  const updateLastMessageDate = date => {
    webchatDispatch({
      type: UPDATE_LAST_MESSAGE_DATE,
      payload: date,
    })
  }
  const setCurrentAttachment = attachment => {
    webchatDispatch({
      type: SET_CURRENT_ATTACHMENT,
      payload: attachment,
    })
  }

  return {
    webchatState,
    webchatDispatch,
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
    toggleCoverComponent,
    setError,
    clearMessages,
    updateLastMessageDate,
    setCurrentAttachment,
  }
}

export function useTyping({ webchatState, updateTyping, updateMessage }) {
  useEffect(() => {
    let delayTimeout, typingTimeout
    scrollToBottom()
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

export function useComponentVisible(initialIsVisible, onClickOutside) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef(null)
  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
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

export function useNetwork() {
  const [isOnline, setNetwork] = useState(window.navigator.onLine)
  const updateNetwork = () => {
    setNetwork(window.navigator.onLine)
  }
  useEffect(() => {
    window.addEventListener('offline', updateNetwork)
    window.addEventListener('online', updateNetwork)
    return () => {
      window.removeEventListener('offline', updateNetwork)
      window.removeEventListener('online', updateNetwork)
    }
  })
  return isOnline
}
