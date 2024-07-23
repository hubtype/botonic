import { BotRequest, Plugin } from '@botonic/core'
import axios from 'axios'

import { HtEvent } from './event-models'
import { EventType, HtEventProps, RequestData } from './types'
import { createHtEvent } from './utils'

export interface HubtypeAnalyticsOptions {
  getLanguage?: (request: BotRequest) => string
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
  getLanguage: (request: BotRequest) => string
  getCountry: (request: BotRequest) => string
  constructor(options?: HubtypeAnalyticsOptions) {
    this.baseUrl = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
    this.getLanguage = options?.getLanguage || getDefaultLanguage
    this.getCountry = options?.getCountry || getDefaultCountry
  }

  post(): void {
    return
  }

  getUrl(request: BotRequest, eventType: EventType) {
    const endpoint =
      eventType === EventType.BotEvent ? 'bot_event' : 'web_event'
    const botId = request.session.bot.id
    return `${this.baseUrl}/external/v2/conversational_apps/${botId}/${endpoint}/`
  }

  getRequestData(request: BotRequest): RequestData {
    return {
      language: this.getLanguage(request),
      country: this.getCountry(request),
      userId: request.session.user.id,
      botInteractionId: request.input?.bot_interaction_id,
    }
  }

  async trackEvent(request: BotRequest, htEventProps: HtEventProps) {
    if (request.session.is_test_integration) {
      return Promise.resolve({
        data: 'Event not sent because it is a test integration',
      })
    }

    const requestData = this.getRequestData(request)
    const event = createHtEvent(requestData, htEventProps)
    return this.sendEvent(request, event)
  }

  private sendEvent(request: BotRequest, event: HtEvent) {
    const url = this.getUrl(request, event.type)
    const headers = { Authorization: `Bearer ${request.session._access_token}` }
    const config = event.type !== EventType.WebEvent ? { headers } : undefined

    return axios.post(url, event, config)
  }
}

export * from './types'
export * from './utils'
