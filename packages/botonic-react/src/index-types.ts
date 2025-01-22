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

import {
  BlockInputOption,
  ButtonProps,
  ReplyProps,
  WebchatSettingsProps,
} from './components'
import { CloseWebviewOptions } from './contexts'
import { UseWebchat } from './webchat/context/use-webchat'
import {
  CoverComponentOptions,
  PersistentMenuOptionsTheme,
  ThemeProps,
} from './webchat/theme/types'
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
  persistentMenu?: PersistentMenuOptionsTheme
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
  persistentMenu?: PersistentMenuOptionsTheme
  coverComponent?: CoverComponentOptions
  blockInputs?: BlockInputOption[]
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
  onUserInput(args: OnUserInputArgs): Promise<void>
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
  children: any // messageJSON don't have children prop
  data: any // if message.type === 'text' => message.data = {text: string}
  delay: number
  display: boolean
  enabletimestamps?: boolean
  id: string
  imagestyle?: any
  isUnread: boolean
  json: any
  markdown: boolean // 0 | 1
  replies: ReplyProps[]
  sentBy: SENDERS
  style?: any
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
