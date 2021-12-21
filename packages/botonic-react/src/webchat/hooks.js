import { useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { COLORS, WEBCHAT } from '../constants'
import { scrollToBottom } from '../util/dom'
import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  CLEAR_MESSAGES,
  SET_CURRENT_ATTACHMENT,
  SET_ERROR,
  SET_ONLINE,
  TOGGLE_COVER_COMPONENT,
  TOGGLE_EMOJI_PICKER,
  TOGGLE_IMAGE_PREVIEWER,
  TOGGLE_PERSISTENT_MENU,
  TOGGLE_WEBCHAT,
  UPDATE_DEV_SETTINGS,
  UPDATE_HANDOFF,
  UPDATE_JWT,
  UPDATE_LAST_MESSAGE_DATE,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_LATEST_INPUT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_SESSION,
  UPDATE_THEME,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
} from './actions'
import { webchatReducer } from './webchat-reducer'

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
  session: { user: null },
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
  isImagePreviewerOpened: false,
  lastMessageUpdate: undefined,
  currentAttachment: undefined,
  jwt: null,
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
  const updateSession = session => {
    webchatDispatch({
      type: UPDATE_SESSION,
      payload: session,
    })
  }

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
  const toggleImagePreviewer = toggle =>
    webchatDispatch({
      type: TOGGLE_IMAGE_PREVIEWER,
      payload: toggle,
    })
  const setError = error =>
    webchatDispatch({
      type: SET_ERROR,
      payload: error,
    })
  const setOnline = online =>
    webchatDispatch({
      type: SET_ONLINE,
      payload: online,
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

  const updateJwt = jwt => {
    webchatDispatch({
      type: UPDATE_JWT,
      payload: jwt,
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
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    toggleWebchat,
    toggleEmojiPicker,
    togglePersistentMenu,
    toggleCoverComponent,
    toggleImagePreviewer,
    setError,
    setOnline,
    clearMessages,
    updateLastMessageDate,
    setCurrentAttachment,
    updateJwt,
  }
}

export function useTyping({ webchatState, updateTyping, updateMessage, host }) {
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
    } catch (e) { }
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

export const useComponentWillMount = func => {
  useMemo(func, [])
}
