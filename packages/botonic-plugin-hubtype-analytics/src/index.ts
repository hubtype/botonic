import { BotRequest, Plugin } from '@botonic/core'
import axios from 'axios'

import { HtEvent } from './event-models/ht-event'
import { HtEventProps, RequestData } from './types'

export interface HubtypeAnalyticsOptions {
  getLaguange?: (request: BotRequest) => string
  getCountry?: (request: BotRequest) => string
}

function getDefaultLanguage(request: BotRequest): string {
  return request.session.user.extra_data.language
}

function getDefaultCountry(request: BotRequest): string {
  return request.session.user.extra_data.country
}

export default class BotonicPluginHubtypeAnalytics implements Plugin {
  baseUrl: string
  getLaguange: (request: BotRequest) => string
  getCountry: (request: BotRequest) => string
  constructor(options: HubtypeAnalyticsOptions) {
    this.baseUrl = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
    this.getLaguange = options.getLaguange || getDefaultLanguage
    this.getCountry = options.getCountry || getDefaultCountry
  }

  post(): void {
    return
  }

  getUrl(request: BotRequest) {
    return `${this.baseUrl}/external/v1/conversational_apps/${request.session.bot.id}/bot_event/`
  }

  getRequestData(request: BotRequest): RequestData {
    return {
      language: this.getLaguange(request),
      country: this.getCountry(request),
      provider: request.session.user.provider,
      userId: request.session.user.id,
    }
  }

  async trackEvent(request: BotRequest, htEventProps: HtEventProps) {
    const url = this.getUrl(request)
    const requestData = this.getRequestData(request)
    const event = HtEvent.create(requestData, htEventProps)
    const headers = { Authorization: `Bearer ${request.session._access_token}` }
    const config = { headers }
    return axios.post(url, event, config)
  }
}
