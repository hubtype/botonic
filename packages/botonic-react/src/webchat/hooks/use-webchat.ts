import { Input, Session } from '@botonic/core'
import { useReducer } from 'react'

import { ThemeProps, Webview } from '../../components/index-types'
import { COLORS, WEBCHAT } from '../../constants'
import { WebchatMessage } from '../../index-types'
import { WebchatAction } from '../actions'
import { DevSettings, ErrorMessage, WebchatState } from '../index-types'
import { webchatReducer } from '../webchat-reducer'

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
  numUnreadMessages: 0,
  isLastMessageVisible: true,
}

export function useWebchat() {
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    webchatInitialState
  )

  const addMessage = (message: WebchatMessage) =>
    webchatDispatch({ type: WebchatAction.ADD_MESSAGE, payload: message })

  const addMessageComponent = (message: { props: WebchatMessage }) =>
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

  const resetUnreadMessages = () => {
    webchatDispatch({
      type: WebchatAction.RESET_UNREAD_MESSAGES,
    })
  }

  const setLastMessageVisible = (isLastMessageVisible: boolean) => {
    webchatDispatch({
      type: WebchatAction.SET_LAST_MESSAGE_VISIBLE,
      payload: isLastMessageVisible,
    })
  }

  return {
    addMessage,
    addMessageComponent,
    clearMessages,
    doRenderCustomComponent,
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
