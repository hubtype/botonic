import { Session } from '@botonic/core'
import { useReducer, useRef } from 'react'

import { Reply } from '../../components'
import { Webview } from '../../components/index-types'
import { COLORS, WEBCHAT } from '../../constants'
import { WebchatMessage } from '../../index-types'
import { ThemeProps } from '../theme/types'
import { WebchatAction } from './actions'
import { ClientInput, DevSettings, ErrorMessage, WebchatState } from './types'
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
  lastRoutePath: undefined,
  handoff: false,
  // TODO: type create a defaultTheme using ThemeProps, and put this in initialState
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
  numUnreadMessages: 0,
  isLastMessageVisible: true,
  isInputFocused: false,
}

export interface UseWebchat {
  addMessage: (message: WebchatMessage) => void
  addMessageComponent: (message: { props: WebchatMessage }) => void
  clearMessages: () => void
  doRenderCustomComponent: (toggle: boolean) => void
  resetUnreadMessages: () => void
  setCurrentAttachment: (attachment?: File) => void
  setError: (error?: ErrorMessage) => void
  setIsInputFocused: (isInputFocused: boolean) => void
  setLastMessageVisible: (isLastMessageVisible: boolean) => void
  setOnline: (online: boolean) => void
  toggleCoverComponent: (toggle: boolean) => void
  toggleEmojiPicker: (toggle: boolean) => void
  togglePersistentMenu: (toggle: boolean) => void
  toggleWebchat: (toggle: boolean) => void
  updateDevSettings: (settings: DevSettings) => void
  updateHandoff: (handoff: boolean) => void
  updateLastMessageDate: (date: string) => void
  updateLastRoutePath: (path: string) => void
  updateLatestInput: (input: ClientInput) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: (typeof Reply)[]) => void
  updateSession: (session: Partial<Session>) => void
  updateTheme: (theme: ThemeProps, themeUpdates?: ThemeProps) => void
  updateTyping: (typing: boolean) => void
  updateWebview: (webview: Webview, params: Record<string, string>) => void
  removeReplies: () => void
  removeWebview: () => void
  webchatState: WebchatState
  webchatContainerRef: React.MutableRefObject<HTMLDivElement | null>
  headerRef: React.MutableRefObject<HTMLDivElement | null>
  chatAreaRef: React.MutableRefObject<HTMLDivElement | null>
  scrollableMessagesListRef: React.MutableRefObject<HTMLDivElement | null>
  repliesRef: React.MutableRefObject<HTMLDivElement | null>
  inputPanelRef: React.MutableRefObject<HTMLDivElement | null>
}

export function useWebchat(): UseWebchat {
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    webchatInitialState
  )

  const webchatContainerRef = useRef<HTMLDivElement | null>(null)
  const chatAreaRef = useRef<HTMLDivElement | null>(null)
  const inputPanelRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const scrollableMessagesListRef = useRef<HTMLDivElement | null>(null)
  const repliesRef = useRef<HTMLDivElement | null>(null)

  const addMessage = (message: WebchatMessage) =>
    webchatDispatch({ type: WebchatAction.ADD_MESSAGE, payload: message })

  const addMessageComponent = (message: { props: WebchatMessage }) =>
    webchatDispatch({
      type: WebchatAction.ADD_MESSAGE_COMPONENT,
      payload: message,
    })

  const updateMessage = (message: WebchatMessage) =>
    webchatDispatch({ type: WebchatAction.UPDATE_MESSAGE, payload: message })

  const updateReplies = (replies: (typeof Reply)[]) =>
    webchatDispatch({ type: WebchatAction.UPDATE_REPLIES, payload: replies })

  const removeReplies = () =>
    webchatDispatch({ type: WebchatAction.REMOVE_REPLIES, payload: [] })

  const updateLatestInput = (input: ClientInput) =>
    webchatDispatch({ type: WebchatAction.UPDATE_LATEST_INPUT, payload: input })

  const updateTyping = (typing: boolean) =>
    webchatDispatch({ type: WebchatAction.UPDATE_TYPING, payload: typing })

  const updateWebview = (webview: Webview, params: Record<string, string>) =>
    webchatDispatch({
      type: WebchatAction.UPDATE_WEBVIEW,
      payload: { webview, webviewParams: params },
    })

  const removeWebview = () =>
    webchatDispatch({
      type: WebchatAction.REMOVE_WEBVIEW,
    })

  const updateSession = (session: Partial<Session>) => {
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

  const setError = (error?: ErrorMessage) =>
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

  const setCurrentAttachment = (attachment?: File) => {
    webchatDispatch({
      type: WebchatAction.SET_CURRENT_ATTACHMENT,
      payload: attachment,
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

  const setIsInputFocused = (isInputFocused: boolean) => {
    webchatDispatch({
      type: WebchatAction.SET_IS_INPUT_FOCUSED,
      payload: isInputFocused,
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
    removeReplies,
    removeWebview,
    webchatState,
    webchatContainerRef,
    headerRef,
    chatAreaRef,
    scrollableMessagesListRef,
    repliesRef,
    inputPanelRef,
  }
}
