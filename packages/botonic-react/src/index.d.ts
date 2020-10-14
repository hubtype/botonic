import * as React from 'react'
import * as core from '@botonic/core/src'
import {
  BlockInputOption,
  ButtonProps,
  CoverComponentOptions,
  PersistentMenuProps,
  ReplyProps,
  ThemeProps,
  WebchatSettingsProps,
} from './components'

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
    request: ActionRequest,
    actions,
  }): Promise<React.ReactNode>
}

export class NodeApp {
  constructor(options: BotOptions)
  bot: ReactBot

  renderNode(args): string
  input(request: core.BotRequest): BotResponse
}

// Parameters of the actions' botonicInit method
export interface ActionRequest {
  session: core.Session
  params: { [key: string]: string }
  input: core.Input
  plugins: { [id: string]: core.Plugin }
  defaultTyping: number
  defaultDelay: number
  lastRoutePath: string
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

export interface WebchatAppArgs {
  theme?: ThemeProps
  persistentMenu?: PersistentMenuProps
  coverComponent?: CoverComponentOptions
  blockInputs?: BlockInputOption[]
  enableEmojiPicker?: boolean
  enableAttachments?: boolean
  enableUserInput?: boolean
  enableAnimations?: boolean
  defaultDelay?: number
  defaultTyping?: number
  storage?: Storage
  onInit: onOpen
  onClose
  onMessage
  appId?: string
  visibility?: () => boolean
}

export interface WebchatMessage {
  id: string
  type: core.InputType
  data: any
  timestamp: string
  markdown: boolean
  from: 'user' | 'bot'
  buttons: ButtonProps[]
  delay: number
  typing: number
  replies: ReplyProps[]
  display: boolean
  ack: 0 | 1
}

export interface OnUserInputArgs {
  user: core.SessionUser
  input: core.Input
  // Below for WebchatDevApp
  session?: core.Session
  lastRoutePath?: string
}

export interface OnStateChangeArgs {
  user: core.SessionUser
  messagesJSON: WebchatMessage[]
}

export type MessageInfo = {
  id: string
  type: 'update_webchat_settings' | 'sender_action'
  data: any | 'typing_on'
}

export type Event = {
  isError?: boolean
  action?: 'update_message_info'
  message?: MessageInfo
}

export class WebchatApp {
  constructor(options: WebchatAppArgs)
  onInitWebchat(args: any): void
  onOpenWebchat(args: any): void
  onCloseWebchat(args: any): void
  onUserInput(args: OnUserInputArgs): Promise<void>
  resendUnsentInputs(): Promise<void>
  onStateChange(args: OnStateChangeArgs): void
  onServiceEvent(event: Event): void
  updateUser(user: core.SessionUser): void
  addBotMessage(message: WebchatMessage): void
  addBotText(text: string): void
  addUserMessage(message: WebchatMessage): void
  addUserText(text: string): void
  addUserPayload(payload: string): void
  setTyping(typing: number): void
  open(): void
  close(): void
  toggle(): void
  openCoverComponent(): void
  closeCoverComponent(): void
  toggleCoverComponent(): void
  getMessages(): WebchatMessage[]
  clearMessages(): void
  getVisibility(): Promise<boolean>
  getLastMessageUpdate(): Date
  updateMessageInfo(msgId: string, messageInfo: MessageInfo): void
  updateWebchatSettings(settings: WebchatSettingsProps): void
  getComponent(
    optionsAtRuntime?: WebchatAppArgs
  ): React.ForwardRefExoticComponent<any>
  isWebchatVisible({ appId: string }): Promise<boolean>
  resolveWebchatVisibility(optionsAtRuntime: {
    appId: string
    visibility: () => boolean
  }): Promise<boolean>
  render(dest: HTMLElement, optionsAtRuntime: WebchatAppArgs): void
}

export class DevApp extends WebchatApp {
  constructor(args: WebchatAppArgs)
  render(dest: HTMLElement, optionsAtRuntime: WebchatAppArgs): void
  onUserInput(args: OnUserInputArgs): Promise<void>
}

export * from './components'
