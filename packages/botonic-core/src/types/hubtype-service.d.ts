/* eslint-disable node/no-missing-import */
import { AxiosResponse } from 'axios'
import Pusher, { Channel } from 'pusher-js'

import { Input, SessionUser } from '.'

interface UnsentInput {
  id: string
  ack: number
  unsentInput: Input
}

interface HubtypeServiceArgs {
  appId: string
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: UnsentInput[]
}

export declare class HubtypeService {
  constructor(args: HubtypeServiceArgs)
  appId: string
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: { id: string; ack: number; unsentInput: Input }
  init(
    user: SessionUser,
    lastMessageId: string,
    lastMessageUpdateDate: string
  ): Promise<any>
  pusher: Pusher
  channel: Channel
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
