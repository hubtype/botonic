import axios, { AxiosResponse } from 'axios'
import Pusher, { AuthOptions, Channel } from 'pusher-js'
import Channels from 'pusher-js/types/src/core/channels/channels'

import { Input, SessionUser } from './models'
import { decompressData } from './pusher-utils'
import { getWebpackEnvVar } from './utils'

interface UnsentInput {
  id: string
  ack: number
  unsentInput: Input
}
interface BotonicHeaders {
  'X-BOTONIC-USER-ID': string
  'X-BOTONIC-LAST-MESSAGE-ID': string
  'X-BOTONIC-LAST-MESSAGE-UPDATE-DATE': string
}
interface ServerConfig {
  activityTimeout?: number
  pongTimeout?: number
}
interface HubtypeServiceArgs {
  appId: string
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: () => UnsentInput[]
  server: ServerConfig
}

const _WEBCHAT_PUSHER_KEY_ = getWebpackEnvVar(
  // @ts-ignore
  typeof WEBCHAT_PUSHER_KEY !== 'undefined' && WEBCHAT_PUSHER_KEY,
  'WEBCHAT_PUSHER_KEY',
  '434ca667c8e6cb3f641c' // pragma: allowlist secret
)
const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  // @ts-ignore
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
  user: SessionUser
  lastMessageId: string
  lastMessageUpdateDate: string
  onEvent: any
  unsentInputs: () => UnsentInput[]
  pusher: Pusher | null
  channel: Channel
  server: ServerConfig
  PUSHER_CONNECT_TIMEOUT_MS = 10000
  constructor({
    appId,
    user,
    lastMessageId,
    lastMessageUpdateDate,
    onEvent,
    unsentInputs,
    server,
  }: HubtypeServiceArgs) {
    this.appId = appId
    this.user = user || {}
    this.lastMessageId = lastMessageId
    this.lastMessageUpdateDate = lastMessageUpdateDate
    this.onEvent = onEvent
    this.unsentInputs = unsentInputs
    this.server = server
    if (this.user.id && (lastMessageId || lastMessageUpdateDate)) {
      // It's safe not awaiting Promise because:
      // * it will never be called from AWS lambda
      // * though init() is called again from postMesage, it does nothing if Pusher already created
      // @ts-ignore
      this.init()
    }
  }

  /**
   * @returns {Promise<void>}
   */
  init(user, lastMessageId, lastMessageUpdateDate): Promise<void> {
    if (user) this.user = user
    if (lastMessageId) this.lastMessageId = lastMessageId
    if (lastMessageUpdateDate)
      this.lastMessageUpdateDate = lastMessageUpdateDate
    return this._initPusher()
  }

  /**
   * @returns {Promise<void>}
   */
  _initPusher(): Promise<void> {
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
      } as AuthOptions,
      ...this.resolveServerConfig(),
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    const connectionPromise = new Promise<void>((resolve, reject) => {
      const cleanAndReject = msg => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearTimeout(connectTimeout)
        this.destroyPusher()
        reject(msg)
      }
      const connectTimeout = setTimeout(
        () => cleanAndReject('Connection Timeout'),
        this.PUSHER_CONNECT_TIMEOUT_MS
      )
      this.channel.bind('pusher:subscription_succeeded', () => {
        // Once subscribed, we know that authentication has been done: https://pusher.com/docs/channels/server_api/authenticating-users
        this.onConnectionRegained()
        clearTimeout(connectTimeout)
        resolve()
      })
      this.channel.bind('botonic_response', data => this.onPusherEvent(data))
      this.channel.bind('botonic_response_compressed', compressedData => {
        try {
          const data = JSON.parse(decompressData(compressedData))
          this.onPusherEvent(data)
        } catch (e) {
          console.error('Error: Unable to decompress data', e)
        }
      })
      this.channel.bind('update_message_info', data => this.onPusherEvent(data))

      this.pusher &&
        this.pusher.connection.bind('error', event => {
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
    this.pusher.connection.bind('state_change', states => {
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
    return headers as BotonicHeaders
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

  onPusherEvent(event: any): void {
    if (this.onEvent && typeof this.onEvent === 'function') this.onEvent(event)
  }

  get pusherChannel(): string {
    return `private-encrypted-${this.appId}-${this.user.id}`
  }

  handleSentInput(message: any): void {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 1 },
    })
  }

  handleUnsentInput(message: any): void {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 0, unsentInput: message },
    })
  }

  /**
   * @return {Promise<void>}
   */
  async postMessage(user: SessionUser, message: any): Promise<void> {
    try {
      // @ts-ignore
      await this.init(user)
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
  }): Promise<AxiosResponse<any>> {
    return axios.get(
      `${_HUBTYPE_API_URL_}/v1/provider_accounts/${appId}/visibility/`
    )
  }

  destroyPusher(): void {
    if (!this.pusher) return
    this.pusher.disconnect()
    this.pusher.unsubscribe(this.pusherChannel)
    this.pusher.unbind_all()
    this.pusher.channels = {} as Channels
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
