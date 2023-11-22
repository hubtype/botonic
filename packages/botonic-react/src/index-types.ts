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

// TODO: Reuse types to be reused in respective components
// export class WebchatApp {
//   constructor(options: WebchatAppArgs)
//   addBotMessage(message: WebchatMessage): void
//   addBotText(text: string): void
//   addUserMessage(message: WebchatMessage): void
//   addUserPayload(payload: string): void
//   addUserText(text: string): void
//   clearMessages(): void
//   close(): void
//   closeCoverComponent(): void
//   destroy(): void
//   getComponent(
//     host: HTMLElement,
//     optionsAtRuntime?: WebchatAppArgs
//   ): React.ForwardRefExoticComponent<any>
//   getLastMessageUpdate(): string
//   getMessages(): WebchatMessage[]
//   getVisibility(): Promise<boolean>
//   isWebchatVisible({ appId: string }): Promise<boolean>
//   onCloseWebchat(args: any): void
//   onInitWebchat(args: any): void
//   onOpenWebchat(args: any): void
//   onServiceEvent(event: Event): void
//   onStateChange(args: OnStateChangeArgs): void
//   onUserInput(args: OnUserInputArgs): Promise<void>
//   open(): void
//   openCoverComponent(): void
//   render(dest?: HTMLElement, optionsAtRuntime?: WebchatAppArgs): void
//   resendUnsentInputs(): Promise<void>
//   resolveWebchatVisibility(optionsAtRuntime: {
//     appId: string
//     visibility: () => boolean
//   }): Promise<boolean>
//   setTyping(enable: boolean): void
//   toggle(): void
//   toggleCoverComponent(): void
//   updateMessageInfo(msgId: string, messageInfo: MessageInfo): void
//   updateLastMessageDate(date: string): void
//   updateUser(user: Partial<CoreSessionUser>): void
//   updateWebchatSettings(settings: WebchatSettingsProps): void
//   renderCustomComponent(customComponent: React.ReactNode): void
//   unmountCustomComponent(): void
// }

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
  persistentMenu?: PersistentMenuTheme
  storage?: Storage | null
  storageKey?: any
  theme?: ThemeProps
}

// export interface WebchatAppArgs extends WebchatArgs {
export interface WebchatAppArgs {
  appId?: string
  visibility?: () => boolean
}

export enum SENDERS {
  bot = 'bot',
  user = 'user',
  agent = 'agent',
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
  data: any | 'typing_on'
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
  closeWebview: () => void
  getThemeProperty: (property: string, defaultValue?: string | boolean) => any
  openWebview: (webviewComponent: Webview) => void
  resetUnreadMessages: () => void
  resolveCase: () => void
  sendAttachment: (attachment: File) => void
  sendInput: (input: CoreInput) => void
  sendPayload: (payload: string) => void
  sendText: (text: string, payload?: string) => void
  setLastMessageVisible: (isLastMessageVisible: boolean) => void
  theme: ThemeProps
  toggleWebchat: (toggle: boolean) => void
  updateLatestInput: (input: CoreInput) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: boolean) => void
  updateUser: (user: Partial<CoreSessionUser>) => void
  updateWebchatDevSettings: (settings: WebchatSettingsProps) => void
  webchatState: WebchatState
}

// export class DevApp extends WebchatApp {
//   constructor(args: WebchatAppArgs)
//   onUserInput(args: OnUserInputArgs): Promise<void>
//   render(dest: HTMLElement, optionsAtRuntime: WebchatAppArgs): void
// }
