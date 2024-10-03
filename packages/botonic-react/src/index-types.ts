import {
  BotRequest as CoreBotRequest,
  Input as CoreInput,
  InputType as CoreInputType,
  Plugin as CorePlugin,
  Route as CoreRoute,
  Routes as CoreRoutes,
  Session as CoreSession,
  SessionUser as CoreSessionUser,
} from '@botonic/core'
import React from 'react'

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

export interface CustomMessageType {
  customTypeName: string
}

export interface WebchatArgs {
  blockInputs?: BlockInputOption[]
  coverComponent?: CoverComponentOptions
  defaultDelay?: number
  defaultTyping?: number
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  shadowDOM?: boolean | (() => boolean)
  hostId?: string
  getString?: (stringId: string, session: CoreSession) => string
  onClose?: (app: WebchatApp, args: any) => void
  onInit?: (app: WebchatApp, args: any) => void
  onMessage?: (app: WebchatApp, message: WebchatMessage) => void
  onOpen?: (app: WebchatApp, args: any) => void
  onConnectionChange?: (app: WebchatApp, isOnline: boolean) => void
  onTrackEvent?: TrackEventFunction
  persistentMenu?: PersistentMenuTheme
  storage?: Storage | null
  storageKey?: any
  theme?: ThemeProps
}

type EventArgs = { [key: string]: any }
type TrackEventFunction = (
  request: ActionRequest,
  eventName: string,
  args?: EventArgs
) => Promise<void>

export interface WebchatAppArgs {
  appId?: string
  visibility?: () => boolean
}

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
  user: CoreSessionUser
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

export interface Event {
  action?: 'update_message_info'
  isError?: boolean
  message?: MessageInfo
}

export interface WebchatContextProps {
  addMessage: (message: WebchatMessage) => void
  closeWebview: () => Promise<void>
  getThemeProperty: (property: string, defaultValue?: any) => any
  openWebview: (webviewComponent: Webview) => void
  resetUnreadMessages: () => void
  resolveCase: () => void
  sendAttachment: (attachment: File) => Promise<void>
  sendInput: (input: CoreInput) => Promise<void>
  sendPayload: (payload: string) => Promise<void>
  sendText: (text: string, payload?: string) => Promise<void>
  setLastMessageVisible: (isLastMessageVisible: boolean) => void
  theme: ThemeProps
  toggleWebchat: (toggle: boolean) => void
  toggleEmojiPicker: (toggle: boolean) => void
  togglePersistentMenu: (toggle: boolean) => void
  updateLatestInput: (input: CoreInput) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: boolean) => void
  updateUser: (user: Partial<CoreSessionUser>) => void
  updateWebchatDevSettings: (settings: WebchatSettingsProps) => void
  webchatState: WebchatState
  trackEvent: TrackEventFunction
  webchatRef: React.MutableRefObject<HTMLDivElement | null>
  chatAreaRef: React.MutableRefObject<HTMLDivElement | null>
  inputPanelRef: React.MutableRefObject<HTMLDivElement | null>
  headerRef: React.MutableRefObject<HTMLDivElement | null>
  scrollableMessagesListRef: React.MutableRefObject<HTMLDivElement | null>
  repliesRef: React.MutableRefObject<HTMLDivElement | null>
}
