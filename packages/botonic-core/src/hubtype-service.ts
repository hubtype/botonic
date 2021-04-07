import axios, { AxiosPromise } from 'axios'
import Pusher, { Channel } from 'pusher-js'

import {
  BotonicHeaders,
  HubtypeServiceArgs,
  InitArgs,
  ServerConfig,
  SessionUser,
  UnsentInput,
} from './types'
import { getWebpackEnvVar } from './utils'

declare const WEBCHAT_PUSHER_KEY: string
const _WEBCHAT_PUSHER_KEY_ = getWebpackEnvVar(
  typeof WEBCHAT_PUSHER_KEY !== 'undefined' && WEBCHAT_PUSHER_KEY,
  'WEBCHAT_PUSHER_KEY',
  '434ca667c8e6cb3f641c'
)

declare const HUBTYPE_API_URL: string
const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  typeof HUBTYPE_API_URL !== 'undefined' && HUBTYPE_API_URL,
  'HUBTYPE_API_URL',
  'https://api.hubtype.com'
)

const ACTIVITY_TIMEOUT = 20 * 1000 // https://pusher.com/docs/channels/using_channels/connection#activitytimeout-integer-
const PONG_TIMEOUT = 5 * 1000 // https://pusher.com/docs/channels/using_channels/connection#pongtimeout-integer-

/**
 * Calls Hubtype APIs from Webchat
 */
export class HubtypeService {
  appId: string
  user: SessionUser | Record<string, never>
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: () => UnsentInput[]
  server: ServerConfig
  pusher: Pusher | null
  channel: Channel
  PUSHER_CONNECT_TIMEOUT_MS = 10000

  constructor(args: HubtypeServiceArgs) {
    this.appId = args.appId
    this.user = args.user || {}
    this.lastMessageId = args.lastMessageId
    this.lastMessageUpdateDate = args.lastMessageUpdateDate
    this.onEvent = args.onEvent
    this.unsentInputs = args.unsentInputs
    this.server = args.server
    if (this.user.id && (args.lastMessageId || args.lastMessageUpdateDate)) {
      // It's safe not awaiting Promise because:
      // * it will never be called from AWS lambda
      // * though init() is called again from postMesage, it does nothing if Pusher already created
      this.init()
    }
  }

  /**
   * @returns {Promise<void>}
   */
  init(args?: InitArgs): Promise<unknown> {
    if (args?.user) this.user = args.user
    if (args?.lastMessageId) this.lastMessageId = args.lastMessageId
    if (args?.lastMessageUpdateDate)
      this.lastMessageUpdateDate = args.lastMessageUpdateDate
    return this._initPusher()
  }

  /**
   * @returns {Promise<void>}
   */
  _initPusher(): Promise<unknown> {
    if (this.pusher) return Promise.resolve()
    if (!this.user.id || !this.appId) {
      // TODO recover user & appId somehow
      return Promise.reject('No User or appId. Clear cache and reload')
    }
    this.pusher = new Pusher(_WEBCHAT_PUSHER_KEY_, {
      cluster: 'eu',
      authEndpoint: `${_HUBTYPE_API_URL_}/v1/provider_accounts/webhooks/webchat/${this.appId}/auth/`,
      forceTLS: true,
      auth: {
        headers: this.constructHeaders(),
        params: {},
      },
      ...this.resolveServerConfig(),
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    const connectionPromise = new Promise((resolve, reject): any => {
      const cleanAndReject = (msg: string): void => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearTimeout(connectTimeout)
        this.destroyPusher()
        reject(msg)
      }
      const connectTimeout = setTimeout(
        (): void => cleanAndReject('Connection Timeout'),
        this.PUSHER_CONNECT_TIMEOUT_MS
      )
      this.channel.bind('pusher:subscription_succeeded', () => {
        // Once subscribed, we know that authentication has been done: https://pusher.com/docs/channels/server_api/authenticating-users
        this.onConnectionRegained()
        clearTimeout(connectTimeout)
        resolve('Connected')
      })
      this.channel.bind('botonic_response', data => this.onPusherEvent(data))
      this.channel.bind('update_message_info', data => this.onPusherEvent(data))

      this.pusher?.connection.bind('error', event => {
        if (event.type == 'WebSocketError') this.handleConnectionChange(false)
        else {
          const errorMsg =
            event.error && event.error.data
              ? event.error.data.code || event.error.data.message
              : 'Connection error'
          cleanAndReject(`Pusher error (${errorMsg})`)
        }
      })
    })
    this.pusher?.connection.bind('state_change', states => {
      if (states.current === 'connecting') this.updateAuthHeaders()
      if (states.current === 'connected') this.handleConnectionChange(true)
      if (states.current === 'unavailable') this.handleConnectionChange(false)
    })

    return connectionPromise
  }

  constructHeaders(): BotonicHeaders {
    const headers = {}
    if (this.user && this.user.id) headers['X-BOTONIC-USER-ID'] = this.user.id
    if (this.lastMessageId)
      headers['X-BOTONIC-LAST-MESSAGE-ID'] = this.lastMessageId
    if (this.lastMessageUpdateDate)
      headers['X-BOTONIC-LAST-MESSAGE-UPDATE-DATE'] = this.lastMessageUpdateDate
    return headers
  }

  resolveServerConfig(): ServerConfig {
    if (!this.server) {
      return { activityTimeout: ACTIVITY_TIMEOUT, pongTimeout: PONG_TIMEOUT }
    }
    return {
      activityTimeout: this.server.activityTimeout || ACTIVITY_TIMEOUT,
      pongTimeout: this.server.pongTimeout || PONG_TIMEOUT,
    }
  }

  updateAuthHeaders(): void {
    if (this.pusher) {
      this.pusher.config.auth.headers = {
        ...this.pusher.config.auth.headers,
        ...this.constructHeaders(),
      }
    }
  }

  handleConnectionChange(online: boolean): void {
    this.onPusherEvent({ action: 'connectionChange', online })
  }

  onPusherEvent(event): void {
    if (this.onEvent && typeof this.onEvent === 'function') this.onEvent(event)
  }

  get pusherChannel(): string {
    return `private-encrypted-${this.appId}-${this.user.id}`
  }

  handleSentInput(message): void {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 1 },
    })
  }

  handleUnsentInput(message): void {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 0, unsentInput: message },
    })
  }

  /**
   * @return {Promise<void>}
   */
  async postMessage(
    user: SessionUser | Record<string, never>,
    message
  ): Promise<void> {
    try {
      await this.init({ user })
      await axios.post(
        `${_HUBTYPE_API_URL_}/v1/provider_accounts/webhooks/webchat/${this.appId}/`,
        {
          sender: this.user,
          message: message,
        },
        {
          validateStatus: status => status === 200,
        }
      )
      this.handleSentInput(message)
    } catch (e) {
      this.handleUnsentInput(message)
    }
    return Promise.resolve()
  }

  static async getWebchatVisibility({
    appId,
  }: {
    appId: string
  }): Promise<AxiosPromise<any>> {
    return axios.get(
      `${_HUBTYPE_API_URL_}/v1/provider_accounts/${appId}/visibility/`
    )
  }

  destroyPusher(): void {
    if (!this.pusher) return
    this.pusher.disconnect()
    this.pusher.unsubscribe(this.pusherChannel)
    this.pusher.unbind_all()
    this.pusher = null
  }

  async onConnectionRegained(): Promise<void> {
    await this.resendUnsentInputs()
  }

  async resendUnsentInputs(): Promise<void> {
    for (const message of this.unsentInputs()) {
      message.unsentInput &&
        (await this.postMessage(this.user, message.unsentInput))
    }
  }
}
