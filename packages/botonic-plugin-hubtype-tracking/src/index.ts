import { BotRequest, Plugin } from '@botonic/core'
import axios from 'axios'

import { HtEvent } from './types'

export interface HubtypeTrackingOptions {
  baseUrl: string
}

export default class HubtypeTracking implements Plugin {
  baseUrl: string
  constructor(opt: HubtypeTrackingOptions) {
    this.baseUrl = opt.baseUrl
  }

  pre(): void {
    return
  }

  post(): void {
    return
  }

  getUrl(request: BotRequest) {
    return `${this.baseUrl}/external/v1/conversational_apps/${request.session.bot.id}/bot_event/`
  }

  async trackEvent(request: BotRequest, event: HtEvent) {
    const url = this.getUrl(request)
    const data = {
      chat: request.session.user.id,
      event_type: event.event_type,
      event_data: {
        ...event.event_data,
        event_datetime: new Date().toISOString(),
        channel: request.session.user.provider,
      },
    }
    const headers = { Authorization: `Bearer ${request.session._access_token}` }
    console.log({
      url: this.getUrl(request),
      token: request.session._access_token,
      event: data,
    })
    const config = { headers }
    return axios.post(url, data, config)
  }
}
