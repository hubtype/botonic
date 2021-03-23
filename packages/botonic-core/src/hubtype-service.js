import axios from 'axios'
import Pusher from 'pusher-js'

import { getWebpackEnvVar } from './utils'

const _WEBCHAT_PUSHER_KEY_ = getWebpackEnvVar(
  // eslint-disable-next-line no-undef
  typeof WEBCHAT_PUSHER_KEY !== 'undefined' && WEBCHAT_PUSHER_KEY,
  'WEBCHAT_PUSHER_KEY',
  '434ca667c8e6cb3f641c'
)
const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  // eslint-disable-next-line no-undef
  typeof HUBTYPE_API_URL !== 'undefined' && HUBTYPE_API_URL,
  'HUBTYPE_API_URL',
  'https://api.hubtype.com'
)

const ACTIVITY_TIMEOUT = 20 * 1000 // https://pusher.com/docs/channels/using_channels/connection#activitytimeout-integer-
const PONG_TIMEOUT = 5 * 1000 // https://pusher.com/docs/channels/using_channels/connection#pongtimeout-integer-
export class HubtypeService {
  constructor({
    appId,
    user,
    lastMessageId,
    lastMessageUpdateDate,
    onEvent,
    unsentInputs,
    server,
  }) {
    this.appId = appId
    this.user = user || {}
    this.lastMessageId = lastMessageId
    this.lastMessageUpdateDate = lastMessageUpdateDate
    this.onEvent = onEvent
    this.unsentInputs = unsentInputs
    this.server = server
    if (user.id && (lastMessageId || lastMessageUpdateDate)) {
      this.init()
    }
  }

  resolveServerConfig() {
    if (!this.server) {
      return { activityTimeout: ACTIVITY_TIMEOUT, pongTimeout: PONG_TIMEOUT }
    }
    return {
      activityTimeout: this.server.activityTimeout || ACTIVITY_TIMEOUT,
      pongTimeout: this.server.pongTimeout || PONG_TIMEOUT,
    }
  }

  updateAuthHeaders() {
    if (this.pusher) {
      this.pusher.config.auth.headers = {
        ...this.pusher.config.auth.headers,
        ...this.constructHeaders(),
      }
    }
  }

  init(user, lastMessageId, lastMessageUpdateDate) {
    if (user) this.user = user
    if (lastMessageId) this.lastMessageId = lastMessageId
    if (lastMessageUpdateDate)
      this.lastMessageUpdateDate = lastMessageUpdateDate
    if (this.pusher || !this.user.id || !this.appId) return null
    this.pusher = new Pusher(_WEBCHAT_PUSHER_KEY_, {
      cluster: 'eu',
      authEndpoint: `${_HUBTYPE_API_URL_}/v1/provider_accounts/webhooks/webchat/${this.appId}/auth/`,
      forceTLS: true,
      auth: {
        headers: this.constructHeaders(),
      },
      ...this.resolveServerConfig(),
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    const connectionPromise = new Promise((resolve, reject) => {
      const cleanAndReject = msg => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearTimeout(connectTimeout)
        this.destroyPusher()
        reject(msg)
      }
      const connectTimeout = setTimeout(
        () => cleanAndReject('Connection Timeout'),
        10000
      )
      this.channel.bind('pusher:subscription_succeeded', () => {
        // Once subscribed, we know that authentication has been done: https://pusher.com/docs/channels/server_api/authenticating-users
        this.onConnectionRegained()
        clearTimeout(connectTimeout)
        resolve()
      })
      this.channel.bind('botonic_response', data => this.onPusherEvent(data))
      this.channel.bind('update_message_info', data => this.onPusherEvent(data))

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

  constructHeaders() {
    const headers = {}
    if (this.user && this.user.id) headers['X-BOTONIC-USER-ID'] = this.user.id
    if (this.lastMessageId)
      headers['X-BOTONIC-LAST-MESSAGE-ID'] = this.lastMessageId
    if (this.lastMessageUpdateDate)
      headers['X-BOTONIC-LAST-MESSAGE-UPDATE-DATE'] = this.lastMessageUpdateDate
    return headers
  }

  handleConnectionChange(online) {
    this.onPusherEvent({ action: 'connectionChange', online })
  }

  onPusherEvent(event) {
    if (this.onEvent && typeof this.onEvent === 'function') this.onEvent(event)
  }

  get pusherChannel() {
    return `private-encrypted-${this.appId}-${this.user.id}`
  }

  handleSentInput(message) {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 1 },
    })
  }

  handleUnsentInput(message) {
    this.onEvent({
      action: 'update_message_info',
      message: { id: message.id, ack: 0, unsentInput: message },
    })
  }

  async postMessage(user, message) {
    try {
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
  }

  static async getWebchatVisibility({ appId }) {
    return axios.get(
      `${_HUBTYPE_API_URL_}/v1/provider_accounts/${appId}/visibility/`
    )
  }

  destroyPusher() {
    if (!this.pusher) return
    this.pusher.disconnect()
    this.pusher.unsubscribe(this.pusherChannel)
    this.pusher.unbind_all()
    this.pusher.channels = {}
    this.pusher = null
  }

  async onConnectionRegained() {
    await this.resendUnsentInputs()
  }

  async resendUnsentInputs() {
    for (const message of this.unsentInputs()) {
      message.unsentInput &&
        (await this.postMessage(this.user, message.unsentInput))
    }
  }
}
