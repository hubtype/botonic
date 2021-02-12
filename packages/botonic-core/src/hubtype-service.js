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
export class HubtypeService {
  constructor({
    appId,
    user,
    lastMessageId,
    lastMessageUpdateDate,
    onEvent,
    unsentInputs,
  }) {
    this.appId = appId
    this.user = user || {}
    this.lastMessageId = lastMessageId
    this.lastMessageUpdateDate = lastMessageUpdateDate
    this.onEvent = onEvent
    this.unsentInputs = unsentInputs
    if (user.id && (lastMessageId || lastMessageUpdateDate)) {
      this.init()
      this.resendUnsentInputs()
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
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    const connectionPromise = new Promise((resolve, reject) => {
      const cleanAndReject = msg => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearTimeout(connectTimeout)
        this.pusher.connection.unbind()
        this.channel.unbind()
        this.pusher = null
        reject(msg)
      }
      const connectTimeout = setTimeout(
        () => cleanAndReject('Connection Timeout'),
        10000
      )
      this.channel.bind('pusher:subscription_succeeded', () => {
        clearTimeout(connectTimeout)
        resolve()
      })
      this.pusher.connection.bind('error', error => {
        const errorMsg =
          error.error && error.error.data
            ? error.error.data.code || error.error.data.message
            : 'Connection error'
        cleanAndReject(`Pusher error (${errorMsg})`)
      })
    })
    this.channel.bind('botonic_response', data => this.onPusherEvent(data))
    this.channel.bind('update_message_info', data => this.onPusherEvent(data))
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

  // eslint-disable-next-line consistent-return
  async postMessage(user, message) {
    try {
      await this.init(user)
    } catch (e) {
      this.handleUnsentInput(message)
      return Promise.resolve()
    }
    try {
      return axios
        .post(
          `${_HUBTYPE_API_URL_}/v1/provider_accounts/webhooks/webchat/${this.appId}/`,
          {
            sender: this.user,
            message: message,
          }
        )
        .then(res => {
          if (res && res.status === 200) this.handleSentInput(message)
          return
        })
        .catch(e => this.handleUnsentInput(message))
    } catch (e) {
      this.handleUnsentInput(message)
    }
  }

  static async getWebchatVisibility({ appId }) {
    return axios.get(
      `${_HUBTYPE_API_URL_}/v1/provider_accounts/${appId}/visibility/`
    )
  }

  async resendUnsentInputs() {
    for (const message of this.unsentInputs()) {
      message.unsentInput &&
        (await this.postMessage(this.user, message.unsentInput))
    }
  }
}
