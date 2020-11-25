import * as core from '@botonic/core/src'
import * as React from 'react'

import {
  BlockInputOption,
  ButtonProps,
  CoverComponentOptions,
  PersistentMenuTheme,
  ReplyProps,
  ThemeProps,
  WebchatSettingsProps,
  Webview,
} from './components'
import { WebchatState } from './webchat'

/**
 * See @botonic/core's Response for the description of the Response's semantics*/
export interface BotResponse extends core.BotRequest {
  response: [React.ReactNode]
}

export interface Route extends core.Route {
  action?: typeof React.Component
  retryAction?: typeof React.Component
}
type Routes = core.Routes<Route>

export interface BotOptions extends core.BotOptions {
  routes: Routes
}

export class ReactBot extends core.CoreBot {
  renderReactActions({
    actions,
    request: ActionRequest,
  }): Promise<React.ReactNode>
}

export class NodeApp {
  constructor(options: BotOptions)
  bot: ReactBot
  input(request: core.BotRequest): BotResponse
  renderNode(args): string
}

// Parameters of the actions' botonicInit method
export interface ActionRequest {
  defaultDelay: number
  defaultTyping: number
  input: core.Input
  lastRoutePath: string
  params: { [key: string]: string }
  plugins: { [id: string]: core.Plugin }
  session: core.Session
}

export class BotonicInputTester {
  constructor(app: NodeApp)

  text(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>

  payload(
    inp: string,
    session?: core.Session,
    lastRoutePath?: string
  ): Promise<string>
}

export class BotonicOutputTester {
  constructor(app: NodeApp)

  text(out: string, replies?: any): Promise<string>
}

export interface RequestContextInterface extends ActionRequest {
  getString: (stringId: string) => string
  setLocale: (locale: string) => string
}

export const RequestContext: React.Context<RequestContextInterface>
export type RequestContext = React.Context<RequestContextInterface>

export interface CustomMessageType {
  customTypeName: string
}

export function msgToBotonic(
  msg: any,
  customMessageTypes?: CustomMessageType[]
): React.ReactNode

export function msgsToBotonic(
  msgs: any | any[],
  customMessageTypes?: CustomMessageType[]
): React.ReactNode

export interface WebchatArgs {
  blockInputs?: BlockInputOption[]
  coverComponent?: CoverComponentOptions
  defaultDelay?: number
  defaultTyping?: number
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  getString?: (stringId: string, session: core.Session) => string
  onClose?: (app: WebchatApp, args: any) => void
  onInit?: (app: WebchatApp, args: any) => void
  onMessage?: (app: WebchatApp, message: WebchatMessage) => void
  onOpen?: (app: WebchatApp, args: any) => void
  persistentMenu?: PersistentMenuTheme
  storage?: Storage
  storageKey?: any
  theme?: ThemeProps
}

export interface WebchatAppArgs extends WebchatArgs {
  appId?: string
  visibility?: () => boolean
}

export interface WebchatMessage {
  ack: 0 | 1
  buttons: ButtonProps[]
  data: any
  delay: number
  display: boolean
  from: 'user' | 'bot'
  id: string
  markdown: boolean
  replies: ReplyProps[]
  timestamp: string
  type: core.InputType
  typing: number
}

export interface OnUserInputArgs {
  input: core.Input
  lastRoutePath?: string
  session?: core.Session
  user: core.SessionUser
}

export interface OnStateChangeArgs {
  messagesJSON: WebchatMessage[]
  user: core.SessionUser
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

export class WebchatApp {
  constructor(options: WebchatAppArgs)
  addBotMessage(message: WebchatMessage): void
  addBotText(text: string): void
  addUserMessage(message: WebchatMessage): void
  addUserPayload(payload: string): void
  addUserText(text: string): void
  clearMessages(): void
  close(): void
  closeCoverComponent(): void
  getComponent(
    optionsAtRuntime?: WebchatAppArgs
  ): React.ForwardRefExoticComponent<any>
  getLastMessageUpdate(): Date
  getMessages(): WebchatMessage[]
  getVisibility(): Promise<boolean>
  isWebchatVisible({ appId: string }): Promise<boolean>
  onCloseWebchat(args: any): void
  onInitWebchat(args: any): void
  onOpenWebchat(args: any): void
  onServiceEvent(event: Event): void
  onStateChange(args: OnStateChangeArgs): void
  onUserInput(args: OnUserInputArgs): Promise<void>
  open(): void
  openCoverComponent(): void
  render(dest: HTMLElement, optionsAtRuntime: WebchatAppArgs): void
  resendUnsentInputs(): Promise<void>
  resolveWebchatVisibility(optionsAtRuntime: {
    appId: string
    visibility: () => boolean
  }): Promise<boolean>
  setTyping(typing: number): void
  toggle(): void
  toggleCoverComponent(): void
  updateMessageInfo(msgId: string, messageInfo: MessageInfo): void
  updateUser(user: core.SessionUser): void
  updateWebchatSettings(settings: WebchatSettingsProps): void
}

export interface WebchatContextProps {
  sendText: (text: string) => void
  sendAttachment: (attachment: File) => void
  sendPayload: (payload: string) => void
  sendInput: (input: core.Input) => void
  openWebview: (webviewComponent: Webview) => void
  addMessage: (message: WebchatMessage) => void
  updateMessage: (message: WebchatMessage) => void
  updateReplies: (replies: boolean) => void
  updateLatestInput: (input: core.Input) => void
  closeWebview: () => void
  toggleWebchat: () => void
  getThemeProperty: (
    property: string,
    defaultValue?: string
  ) => string | undefined
  resolveCase: () => string
  theme: ThemeProps
  webchatState: WebchatState
  updateWebchatDevSettings: (settings: WebchatSettingsProps) => void
  updateUser: (user: core.SessionUser) => string
}
export const WebchatContext: React.Context<WebchatContextProps>
export type WebchatContext = React.Context<WebchatContextProps>

export class DevApp extends WebchatApp {
  constructor(args: WebchatAppArgs)
  onUserInput(args: OnUserInputArgs): Promise<void>
  render(dest: HTMLElement, optionsAtRuntime: WebchatAppArgs): void
}

export * from './components'
export * from './util'
export * from './webchat'
