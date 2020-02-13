import Pusher from 'pusher-js'
import axios from 'axios'

const PUSHER_KEY = process.env.WEBCHAT_PUSHER_KEY || '434ca667c8e6cb3f641c'
const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

export class HubtypeService {
  constructor({ appId, user, lastMessageId, onEvent }) {
    this.appId = appId
    this.user = user || {}
    this.lastMessageId = lastMessageId
    this.onEvent = onEvent
    if (user.id && lastMessageId) this.init()
  }

  init(user, lastMessageId) {
    if (user) this.user = user
    if (lastMessageId) this.lastMessageId = lastMessageId
    if (this.pusher || !this.user.id || !this.appId) return
    this.pusher = new Pusher(PUSHER_KEY, {
      cluster: 'eu',
      authEndpoint: `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/auth/`,
      forceTLS: true,
      auth: {
        headers: {
          'X-BOTONIC-USER-ID': this.user.id,
          'X-BOTONIC-LAST-MESSAGE-ID': this.lastMessageId,
        },
      },
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    const connectionPromise = new Promise((resolve, reject) => {
      const cleanAndReject = msg => {
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
            ? error.error.data.code || error.data.message
            : 'Connection error'
        cleanAndReject(`Pusher error (${errorMsg})`)
      })
    })
    this.channel.bind('botonic_response', data => this.onPusherEvent(data))
    return connectionPromise
  }

  onPusherEvent(event) {
    if (this.onEvent && typeof this.onEvent === 'function') this.onEvent(event)
  }

  get pusherChannel() {
    return `private-encrypted-${this.appId}-${this.user.id}`
  }

  async postMessage(user, message) {
    try {
      await this.init(user)
    } catch (e) {
      this.onEvent({ isError: true, errorMessage: String(e) })
      return
    }
    return axios.post(
      `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/`,
      {
        sender: this.user,
        message: message,
      }
    )
  }
}
