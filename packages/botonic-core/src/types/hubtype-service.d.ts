import { AxiosResponse } from 'axios'
import Pusher, { Channel } from 'pusher-js'

import { Input, SessionUser } from '.'

export interface UnsentInput {
  id: string
  ack: number
  unsentInput: Input
}

export interface HubtypeServiceArgs {
  appId: string
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: () => UnsentInput[]
  server: ServerConfig
}

export interface BotonicHeaders {
  'X-BOTONIC-USER-ID'?: string
  'X-BOTONIC-USER-LAST-MESSAGE-ID'?: string
  'X-BOTONIC-USER-LAST-MESSAGE-UPDATE-DATE'?: string
}

export interface ServerConfig {
  activityTimeout?: number
  pongTimeout?: number
  errorMessage?: string
}

export interface InitArgs {
  user?: SessionUser | Record<string, never>
  lastMessageId?: string
  lastMessageUpdateDate?: string
}
export declare class HubtypeService {
  appId: string
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: UnsentInput[]
  pusher: Pusher
  channel: Channel

  constructor(args: HubtypeServiceArgs)

  init(
    user: SessionUser,
    lastMessageId: string,
    lastMessageUpdateDate: string
  ): Promise<any>
  _initPusher(): Promise<unknown>
  constructHeaders(): {
    'X-BOTONIC-USER-ID': string
    'X-BOTONIC-LAST-MESSAGE-ID': string
    'X-BOTONIC-LAST-MESSAGE-UPDATE-DATE': string
  }
  onPusherEvent(event: any): void
  get pusherChannel(): string
  handleSentInput(message: any): void
  handleUnsentInput(message: any): void
  postMessage(user: SessionUser, message: any): Promise<void>
  resendUnsentInputs(): Promise<void>
  static getWebchatVisibility({
    appId,
  }: {
    appId: string
  }): Promise<AxiosResponse<any>>
}
