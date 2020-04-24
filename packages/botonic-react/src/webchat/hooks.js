import { useEffect, useReducer, useRef, useState } from 'react'
import { COLORS, WEBCHAT } from '../constants'
import { scrollToBottom } from '../utils'
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
  session: {},
  user: null,
  lastRoutePath: null,
  handoff: false,
  theme: {
    headerTitle: WEBCHAT.DEFAULTS.TITLE,
    brandColor: COLORS.BOTONIC_BLUE,
    brandImage: WEBCHAT.DEFAULTS.LOGO,
    triggerButtonImage: WEBCHAT.DEFAULTS.LOGO,
    textPlaceholder: WEBCHAT.DEFAULTS.PLACEHOLDER,
    style: {
      fontFamily: WEBCHAT.DEFAULTS.FONT_FAMILY,
    },
  },
  error: {},
  devSettings: {},
  isWebchatOpen: false,
  lastMessageUpdate: undefined,
}

export function useWebchat() {
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    webchatInitialState
  )

  const addMessage = message =>
    webchatDispatch({ type: 'addMessage', payload: message })
  const addMessageComponent = message =>
    webchatDispatch({ type: 'addMessageComponent', payload: message })
  const updateMessage = message =>
    webchatDispatch({ type: 'updateMessage', payload: message })
  const updateReplies = replies =>
    webchatDispatch({ type: 'updateReplies', payload: replies })
  const updateLatestInput = input =>
    webchatDispatch({ type: 'updateLatestInput', payload: input })
  const updateTyping = typing =>
    webchatDispatch({ type: 'updateTyping', payload: typing })
  const updateWebview = (webview, params) =>
    webchatDispatch({
      type: 'updateWebview',
      payload: { webview, webviewParams: params },
    })
  const updateSession = session =>
    webchatDispatch({
      type: 'updateSession',
      payload: session,
    })
  const updateUser = user =>
    webchatDispatch({
      type: 'updateUser',
      payload: user,
    })
  const updateLastRoutePath = path =>
    webchatDispatch({
      type: 'updateLastRoutePath',
      payload: path,
    })
  const updateHandoff = handoff =>
    webchatDispatch({
      type: 'updateHandoff',
      payload: handoff,
    })
  const updateTheme = theme =>
    webchatDispatch({
      type: 'updateTheme',
      payload: theme,
    })
  const updateDevSettings = settings =>
    webchatDispatch({
      type: 'updateDevSettings',
      payload: settings,
    })
  const toggleWebchat = toggle =>
    webchatDispatch({
      type: 'toggleWebchat',
      payload: toggle,
    })
  const setError = error =>
    webchatDispatch({
      type: 'setError',
      payload: error,
    })

  const clearMessages = () => {
    webchatDispatch({
      type: 'clearMessages',
    })
  }
  const updateLastMessageDate = date => {
    webchatDispatch({
      type: 'updateLastMessageDate',
      payload: date,
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
    setError,
    clearMessages,
    updateLastMessageDate,
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

export function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef(null)

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { ref, isComponentVisible, setIsComponentVisible }
}
