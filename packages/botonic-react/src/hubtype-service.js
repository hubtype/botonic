import Pusher from 'pusher-js'
import axios from 'axios'

const PUSHER_KEY = 'da85029877df0c827e44'
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

    this.pusher = new Pusher(PUSHER_KEY)
    this.pusher.subscribe(this.pusherChannel)
    this.pusher.bind('botonic_response', event => this.onEvent(event))
  }

  onPusherEvent(event) {
    this.onEvent(event)
  }

  get pusherChannel() {
    return `public-${this.appId}-${this.user.id}`
  }

  async postMessage(user, message) {
    this.initPusher(user)
    return axios.post(
      `${HUBTYPE_API_URL}/v1/provider_accounts/webhooks/webchat/${this.appId}/`,
      {
        sender: this.user,
        message: message
      }
    )
  }
}
