import {
  Input as CoreInput,
  Session as CoreSession,
  SessionUser as CoreSessionUser,
} from '@botonic/core'

import { Reply, WebchatSettingsProps, Webview } from '../../components'
import { CloseWebviewOptions } from '../../contexts'
import { TrackEventFunction, WebchatMessage } from '../../index-types'
import { WebchatStateTheme } from '../index-types'
import { ThemeProps } from '../theme/types'

export interface ErrorMessage {
  message?: string
}

export interface DevSettings {
  keepSessionOnReload?: boolean
  showSessionView?: boolean
}

export interface WebchatState {
  width: number // TODO: move this inside webchatState.theme.style
  height: number // TODO: move this inside webchatState.theme.style
  messagesJSON: any[]
  messagesComponents: any[]
  replies?: (typeof Reply)[]
  latestInput: Partial<CoreInput>
  typing: boolean
  webview: Webview | null
  webviewParams: null
  session: Partial<CoreSession>
  lastRoutePath?: string
  handoff: boolean
  theme: WebchatStateTheme // TODO: type this as ThemeProps
  themeUpdates: Partial<WebchatStateTheme> // TODO: type this as Partial<ThemeProps>
  error: ErrorMessage
  online: boolean
  devSettings: DevSettings
  isWebchatOpen: boolean
  isEmojiPickerOpen: boolean
  isPersistentMenuOpen: boolean
  isCoverComponentOpen: boolean
  isCustomComponentRendered: boolean
  lastMessageUpdate?: string
  currentAttachment?: File
  numUnreadMessages: number
  isLastMessageVisible: boolean
  isInputFocused: boolean
}

// ClientInput: type for sendInput and updateLatestInput function without message_id and bot_interaction_id because backend set this values
export type ClientInput = Omit<CoreInput, 'message_id' | 'bot_interaction_id'>

export interface WebchatContextProps {
  addMessage: (message: WebchatMessage) => void
  getThemeProperty: (property: string, defaultValue?: any) => any
  closeWebview: (options?: CloseWebviewOptions) => Promise<void>
  openWebview: (webviewComponent: Webview, params?: any) => void
  resetUnreadMessages: () => void
  resolveCase: () => void
  sendAttachment: (attachment: File) => Promise<void>
  sendInput: (input: ClientInput) => Promise<void>
  sendPayload: (payload: string) => Promise<void>
  sendText: (text: string, payload?: string) => Promise<void>
  setIsInputFocused: (isInputFocused: boolean) => void
  setLastMessageVisible: (isLastMessageVisible: boolean) => void
  theme: ThemeProps // TODO: Remove this attribute and use allways webchatState.theme
  toggleWebchat: (toggle: boolean) => void
  toggleEmojiPicker: (toggle: boolean) => void
  togglePersistentMenu: (toggle: boolean) => void
  toggleCoverComponent: (toggle: boolean) => void
  updateLatestInput: (input: ClientInput) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: (typeof Reply)[]) => void
  updateUser: (user: Partial<CoreSessionUser>) => void
  updateWebchatDevSettings: (settings: WebchatSettingsProps) => void
  trackEvent?: TrackEventFunction
  webchatState: WebchatState
  webchatContainerRef: React.MutableRefObject<HTMLDivElement | null>
  chatAreaRef: React.MutableRefObject<HTMLDivElement | null>
  inputPanelRef: React.MutableRefObject<HTMLDivElement | null>
  headerRef: React.MutableRefObject<HTMLDivElement | null>
  scrollableMessagesListRef: React.MutableRefObject<HTMLDivElement | null>
  repliesRef: React.MutableRefObject<HTMLDivElement | null>
}
