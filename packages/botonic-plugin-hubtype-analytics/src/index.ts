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
  eventsBaseUrl: string
  getLanguage: (request: BotRequest) => string
  getCountry: (request: BotRequest) => string
  constructor(options?: HubtypeAnalyticsOptions) {
    const hubtypeUrl = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
    this.eventsBaseUrl = `${hubtypeUrl}/external/v2/conversational_apps`
    this.getLanguage = options?.getLanguage || getDefaultLanguage
    this.getCountry = options?.getCountry || getDefaultCountry
  }

  post(): void {
    return
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

  getRequestData(request: BotRequest): RequestData {
    return {
      language: this.getLanguage(request),
      country: this.getCountry(request),
      userId: this.isLambdaEvent(request) ? request.session.user.id : undefined,
      botInteractionId: request.input?.bot_interaction_id,
    }
  }

  private isLambdaEvent(request: BotRequest): boolean {
    return request.session?.bot?.id !== undefined
  }

  private sendEvent(request: BotRequest, event: HtEvent) {
    if (event.type === EventType.BotEvent) {
      return this.sendBotEvent(request, event)
    }

    return this.sendWebEvent(request, event)
  }

  private sendBotEvent(request: BotRequest, event: HtEvent) {
    const botId = request.session.bot.id
    const url = `${this.eventsBaseUrl}/${botId}/bot_event/`
    const config = {
      headers: { Authorization: `Bearer ${request.session._access_token}` },
    }
    return axios.post(url, event, config)
  }

  private sendWebEvent(request: BotRequest, event: HtEvent) {
    if (this.isLambdaEvent(request)) {
      return this.sendWebEventByBotId(request, event)
    }

    return this.sendWebEventByProviderId(request, event)
  }

  private sendWebEventByBotId(request: BotRequest, event: HtEvent) {
    const botId = request.session.bot.id
    const url = `${this.eventsBaseUrl}/${botId}/web_event/`
    return axios.post(url, event)
  }

  private sendWebEventByProviderId(request: BotRequest, event: HtEvent) {
    const url = `${this.eventsBaseUrl}/web_event/`
    const config = {
      params: {
        provider_id: request.session.user.id,
      },
    }
    return axios.post(url, event, config)
  }
}

export * from './types'
export * from './utils'
