import { Input as CoreInput, Session as CoreSession } from '@botonic/core'

import { Reply, WebchatSettingsProps, Webview } from '../../components'
import { CloseWebviewOptions } from '../../contexts'
import { TrackEventFunction, WebchatMessage } from '../../index-types'
import { WebchatTheme } from '../theme/types'

export interface ErrorMessage {
  message?: string
}

export interface DevSettings {
  keepSessionOnReload?: boolean
  showSessionView?: boolean
}

export interface WebchatState {
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
  theme: WebchatTheme
  themeUpdates: Partial<WebchatTheme>
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
// ClientSession: type for session in frontend when webchat is deployed
export type ClientSession = {
  user: ClientUser
}
// ClientUser: type for user in frontend when webchat is deployed
export type ClientUser = {
  id: string
  name: string
  locale: string
  country: string
  system_locale?: string
  extra_data?: Record<string, any>
}

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
  toggleWebchat: (toggle: boolean) => void
  toggleEmojiPicker: (toggle: boolean) => void
  togglePersistentMenu: (toggle: boolean) => void
  toggleCoverComponent: (toggle: boolean) => void
  updateCustomMessageProps: (
    messageId: string,
    json: Record<string, any>
  ) => void
  updateLatestInput: (input: ClientInput) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: (typeof Reply)[]) => void
  updateUser: (user: Partial<ClientUser>) => void
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
