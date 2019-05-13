import { useEffect, useReducer, useState, useRef } from 'react'

export const webchatInitialState = {
  width: 300,
  height: 450,
  messagesJSON: [],
  messagesComponents: [],
  replies: [],
  typing: false,
  webview: null,
  webviewParams: null,
  session: {
    is_first_interaction: true,
    last_session: {},
    user: {
      id: '000001',
      username: 'johndoe',
      name: 'John Doe',
      provider: 'terminal',
      provider_id: '0000000',
      extra_data: {}
    },
    organization: '',
    bot: {
      id: '0000000',
      name: 'botName'
    }
  },
  lastRoutePath: null,
  handoff: false,
  theme: {
    brandColor: '#0099ff',
    textPlaceholder: 'Ask me something...',
    title: 'Botonic'
  },
  devSettings: {
    keepSessionOnReload: true,
    showSessionView: false
  },
  isWebchatOpen: false
}

export function webchatReducer(state, action) {
  switch (action.type) {
    case 'addMessage':
      return {
        ...state,
        messagesJSON: [...state.messagesJSON, { ...action.payload }]
      }
    case 'addMessageComponent':
      return {
        ...state,
        messagesComponents: [...state.messagesComponents, action.payload]
      }
    case 'updateMessage':
      let msgIndex = state.messagesJSON
        .map(m => m.id)
        .indexOf(action.payload.id)
      if (msgIndex > -1)
        return {
          ...state,
          messagesJSON: [
            ...state.messagesJSON.slice(0, msgIndex),
            { ...action.payload },
            ...state.messagesJSON.slice(msgIndex + 1)
          ]
        }
      return state
    case 'updateReplies':
      return { ...state, replies: action.payload }
    case 'updateTyping':
      return { ...state, typing: action.payload }
    case 'updateWebview':
      return { ...state, ...action.payload }
    case 'updateSession':
      return { ...state, session: { ...action.payload } }
    case 'updateLastRoutePath':
      return { ...state, lastRoutePath: action.payload }
    case 'updateHandoff':
      return { ...state, handoff: action.payload }
    case 'updateTheme':
      return { ...state, theme: { ...action.payload } }
    case 'updateDevSettings':
      return { ...state, devSettings: { ...action.payload } }
    case 'triggerWebchat':
      return { ...state, isWebchatOpen: action.payload }
    default:
      throw new Error()
  }
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
  const updateTyping = typing =>
    webchatDispatch({ type: 'updateTyping', payload: typing })
  const updateWebview = (webview, params) =>
    webchatDispatch({
      type: 'updateWebview',
      payload: { webview, webviewParams: params }
    })
  const updateSession = session =>
    webchatDispatch({
      type: 'updateSession',
      payload: session
    })
  const updateLastRoutePath = path =>
    webchatDispatch({
      type: 'updateLastRoutePath',
      payload: path
    })
  const updateHandoff = handoff =>
    webchatDispatch({
      type: 'updateHandoff',
      payload: handoff
    })
  const updateTheme = theme =>
    webchatDispatch({
      type: 'updateTheme',
      payload: theme
    })
  const updateDevSettings = settings =>
    webchatDispatch({
      type: 'updateDevSettings',
      payload: settings
    })
  const triggerWebchat = triggerOption =>
    webchatDispatch({
      type: 'triggerWebchat',
      payload: triggerOption
    })

  return {
    webchatState,
    webchatDispatch,
    addMessage,
    addMessageComponent,
    updateMessage,
    updateReplies,
    updateTyping,
    updateWebview,
    updateSession,
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    triggerWebchat
  }
}

export function useTyping({ webchatState, updateTyping, updateMessage }) {
  useEffect(() => {
    let delayTimeout, typingTimeout
    let end = document.getElementById('messages-end')
    if (end) {
      end.scrollIntoView({ behavior: 'smooth' })
    }
    try {
      let nextMsg = webchatState.messagesJSON.filter(m => !m.display)[0]
      if (nextMsg.delay && nextMsg.typing) {
        delayTimeout = setTimeout(
          () => updateTyping(true),
          nextMsg.delay * 1000
        )
      } else if (nextMsg.typing) updateTyping(true)
      let totalDelay = nextMsg.delay + nextMsg.typing
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
  }, [webchatState.messagesJSON])
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
