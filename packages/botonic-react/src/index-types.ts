import {
  BotRequest as CoreBotRequest,
  Input as CoreInput,
  InputType as CoreInputType,
  Plugin as CorePlugin,
  Route as CoreRoute,
  Routes as CoreRoutes,
  ServerConfig,
  Session as CoreSession,
  SessionUser as CoreSessionUser,
} from '@botonic/core'
import React from 'react'

import { Reply } from './components'
import {
  BlockInputOption,
  ButtonProps,
  CoverComponentOptions,
  PersistentMenuTheme,
  ReplyProps,
  ThemeProps,
  WebchatSettingsProps,
  Webview,
} from './components/index-types'
import { CloseWebviewOptions } from './contexts'
import { UseWebchat } from './webchat/hooks/use-webchat'
import { WebchatState } from './webchat/index-types'
import { WebchatApp } from './webchat-app'

/**
 * See @botonic/core's Response for the description of the Response's semantics*/
export interface BotResponse extends CoreBotRequest {
  response: [React.ReactNode]
}

export interface Route extends CoreRoute {
  action?: React.ComponentType<any>
  retryAction?: React.ComponentType<any>
}
export type Routes = CoreRoutes<Route>

// Parameters of the actions' botonicInit method
export interface ActionRequest {
  defaultDelay: number
  defaultTyping: number
  input: CoreInput
  lastRoutePath: string
  params: { [key: string]: string }
  plugins: { [id: string]: CorePlugin }
  session: CoreSession
}

export interface RequestContextInterface extends ActionRequest {
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
}

export interface WebchatRef {
  addBotResponse: ({
    response,
    session,
    lastRoutePath,
  }: AddBotResponseArgs) => void
  setTyping: (typing: boolean) => void
  addUserMessage: (message: any) => Promise<void>
  updateUser: (userToUpdate: any) => void
  openWebchat: () => void
  closeWebchat: () => void
  toggleWebchat: () => void
  openCoverComponent: () => void
  closeCoverComponent: () => void
  toggleCoverComponent: () => void
  renderCustomComponent: (customComponent: any) => void
  unmountCustomComponent: () => void
  isOnline: () => boolean
  setOnline: (online: boolean) => void
  getMessages: () => { id: string; ack: number; unsentInput: CoreInput }[] // TODO: define MessagesJSON
  clearMessages: () => void
  getLastMessageUpdate: () => string | undefined
  updateMessageInfo: (msgId: string, messageInfo: any) => void
  updateWebchatSettings: (settings: WebchatSettingsProps) => void
  closeWebview: (options?: CloseWebviewOptions) => Promise<void>
}

interface AddBotResponseArgs {
  response: any
  session?: any
  lastRoutePath?: any
}

export interface WebchatArgs {
  theme?: ThemeProps
  persistentMenu?: PersistentMenuTheme
  coverComponent?: CoverComponentOptions
  blockInputs?: BlockInputOption[]
  enableEmojiPicker?: boolean
  enableAttachments?: boolean
  enableUserInput?: boolean
  enableAnimations?: boolean
  hostId?: string
  shadowDOM?: boolean | (() => boolean)
  defaultDelay?: number
  defaultTyping?: number
  storage?: Storage | null
  storageKey?: string
  onInit?: (app: WebchatApp, args: any) => void
  onOpen?: (app: WebchatApp, args: any) => void
  onClose?: (app: WebchatApp, args: any) => void
  onMessage?: (app: WebchatApp, message: WebchatMessage) => void
  onTrackEvent?: TrackEventFunction
  onConnectionChange?: (app: WebchatApp, isOnline: boolean) => void
  appId?: string
  visibility?: boolean | (() => boolean) | 'dynamic'
  server?: ServerConfig
}

export interface WebchatProps {
  webchatHooks?: UseWebchat
  initialSession?: any
  initialDevSettings?: any
  onStateChange: (args: OnStateChangeArgs) => void

  shadowDOM?: any
  theme?: ThemeProps
  persistentMenu?: PersistentMenuTheme
  coverComponent?: any
  blockInputs?: any
  enableEmojiPicker?: boolean
  enableAttachments?: boolean
  enableUserInput?: boolean
  enableAnimations?: boolean
  storage?: Storage | null
  storageKey?: string | (() => string)
  defaultDelay?: number
  defaultTyping?: number
  onInit?: (args?: any) => void
  onOpen?: (args?: any) => void
  onClose?: (args?: any) => void
  onUserInput(args: OnUserInputArgs): Promise<void> // TODO: Review this function and params types
  onTrackEvent?: TrackEventFunction
  host?: any
  server?: ServerConfig
}

export type EventArgs = { [key: string]: any }
export type TrackEventFunction = (
  request: ActionRequest,
  eventName: string,
  args?: EventArgs
) => Promise<void>

export enum SENDERS {
  bot = 'bot',
  user = 'user',
  agent = 'agent',
}

export enum Typing {
  On = 'typing_on',
  Off = 'typing_off',
}

export interface WebchatMessage {
  ack: 0 | 1
  blob: boolean
  buttons: ButtonProps[]
  children: any
  data: any
  delay: number
  display: boolean
  enabletimestamps: boolean
  id: string
  imagestyle: any
  isUnread: boolean
  json: any
  markdown: boolean
  replies: ReplyProps[]
  sentBy: SENDERS
  style: any
  timestamp: string
  type: CoreInputType
  typing: number
}

export interface OnUserInputArgs {
  input: CoreInput
  lastRoutePath?: string
  session?: CoreSession
  user?: CoreSessionUser
}

export interface OnStateChangeArgs {
  messagesJSON: WebchatMessage[]
  user: CoreSessionUser
}

export interface MessageInfo {
  data: any | Typing.On
  id: string
  type: 'update_webchat_settings' | 'sender_action'
}

export type Event = ConnectionChangeEvent | UpdateMessageInfoEvent

interface ConnectionChangeEvent {
  action: 'connectionChange'
  online: boolean
  isError?: boolean
  message?: MessageInfo
}

interface UpdateMessageInfoEvent {
  action: 'update_message_info'
  message: MessageInfo
  isError?: boolean
}

// ClientInput: type for sendInput and updateLatestInput function without message_id and bot_interaction_id because backend set this values
export type ClientInput = Omit<CoreInput, 'message_id' | 'bot_interaction_id'>

export interface WebchatContextProps {
  addMessage: (message: WebchatMessage) => void
  getThemeProperty: (property: string, defaultValue?: any) => any
  openWebview: (webviewComponent: Webview, params?: any) => void
  resetUnreadMessages: () => void
  resolveCase: () => void
  sendAttachment: (attachment: File) => Promise<void>
  sendInput: (input: ClientInput) => Promise<void>
  sendPayload: (payload: string) => Promise<void>
  sendText: (text: string, payload?: string) => Promise<void>
  setIsInputFocused: (isInputFocused: boolean) => void
  setLastMessageVisible: (isLastMessageVisible: boolean) => void
  theme: ThemeProps // TODO: Review if theme is needed and used from WebchatContext
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
  webchatRef: React.MutableRefObject<HTMLDivElement | null> // Rename this to webchatContainerRef
  chatAreaRef: React.MutableRefObject<HTMLDivElement | null>
  inputPanelRef: React.MutableRefObject<HTMLDivElement | null>
  headerRef: React.MutableRefObject<HTMLDivElement | null>
  scrollableMessagesListRef: React.MutableRefObject<HTMLDivElement | null>
  repliesRef: React.MutableRefObject<HTMLDivElement | null>
}
