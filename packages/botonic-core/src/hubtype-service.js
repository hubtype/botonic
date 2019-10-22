import Pusher from 'pusher-js'
import axios from 'axios'

console.log("WEBCHAT_PUSHER_HOST", process.env.WEBCHAT_PUSHER_HOST)
const PUSHER_CLUSTER = process.env.WEBCHAT_PUSHER_CLUSTER
const PUSHER_HOST = process.env.WEBCHAT_PUSHER_HOST || "x7x1mmuj2ghbni33.ypxf72akb6onjvrq.v1.p.beameio.net"
const PUSHER_PORT = process.env.WEBCHAT_PUSHER_PORT
  ? parseInt(process.env.WEBCHAT_PUSHER_PORT)
  : 443
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
    console.log("HUBTYPE_API_URL", HUBTYPE_API_URL)

    console.log("Pusher host port cluster key", PUSHER_HOST, PUSHER_PORT, PUSHER_CLUSTER, PUSHER_KEY)
    this.pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER, //PUSHER_CLUSTER
      authEndpoint: `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/auth/`,
      forceTLS: true,
      auth: {
        headers: {
          'X-BOTONIC-USER-ID': this.user.id,
          'X-BOTONIC-LAST-MESSAGE-ID': this.lastMessageId
        }
      },
      disableStats: true,
      httpHost: PUSHER_HOST,
      httpPort: PUSHER_PORT,
      httpsPort: PUSHER_PORT,
      wsHost: PUSHER_HOST,
      wsPort: PUSHER_PORT,
      wssPort: PUSHER_PORT
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
      this.channel.bind('pusher:subscription_succeeded', () => {
        clearTimeout(connectTimeout)
        resolve()
      })
      this.pusher.connection.bind('error', error => {
        cleanAndReject(
          `Pusher error (${error.error.data.code || JSON.stringify(error)})`
        )
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
        message: message
      }
    )
  }
}
