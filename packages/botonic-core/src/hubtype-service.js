import Pusher from 'pusher-js'
import axios from 'axios'

const PUSHER_KEY = process.env.WEBCHAT_PUSHER_KEY || '434ca667c8e6cb3f641c'
const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

export class HubtypeService {
  constructor({ appId, user, onEvent }) {
    this.appId = appId
    this.user = user || {}
    this.onEvent = onEvent
  }

  initPusher(user) {
    if (user) this.user = user
    if (this.pusher || !this.user.id || !this.appId) return
    this.pusher = new Pusher(PUSHER_KEY, {
      cluster: 'eu',
      authEndpoint: `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/auth/`,
      forceTLS: true,
      auth: {
        headers: {
          'X-BOTONIC-USER-ID': this.user.id
        }
      }
    })
    this.channel = this.pusher.subscribe(this.pusherChannel)
    let connectionPromise = new Promise((resolve, reject) => {
      let cleanAndReject = msg => {
        clearTimeout(connectTimeout)
        this.pusher.connection.unbind()
        this.channel.unbind()
        reject(msg)
      }
      let connectTimeout = setTimeout(
        () => cleanAndReject('Connection Timeout'),
        10000
      )
      this.pusher.connection.bind('connected', () => {
        clearTimeout(connectTimeout)
        resolve()
      })
      this.pusher.connection.bind('error', error => {
        cleanAndReject(`Pusher error (${error.error.data.code})`)
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
      await this.initPusher(user)
    } catch (e) {
      this.onEvent({ isError: true, errorMessage: String(e) })
      return
    }
    return axios.post(
      `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/`,
      {
        sender: this.user,
        message: message
      }
    )
  }
}
