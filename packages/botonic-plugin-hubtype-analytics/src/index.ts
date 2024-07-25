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
    const url = this.getUrl(request, event.type)
    const config = this.getConfig(event, request)

    return axios.post(url, event, config)
  }

  private getUrl(request: BotRequest, eventType: EventType) {
    if (eventType === EventType.BotEvent) {
      const botId = request.session.bot.id
      return `${this.baseUrl}/external/v2/conversational_apps/${botId}/bot_event/`
    }
    return `${this.baseUrl}/external/v2/conversational_apps/web_event/`
  }

  private getConfig(event: HtEvent, request: BotRequest) {
    if (event.type === EventType.BotEvent) {
      return {
        headers: { Authorization: `Bearer ${request.session._access_token}` },
      }
    }

    // this is a web event send from bot lambda or webview
    if (this.isLambdaEvent(request)) {
      return {
        params: {
          bot_id: request.session.bot.id,
        },
      }
    }

    // this is a web event send from webchat
    return {
      params: {
        provider_id: request.session.user.id,
      },
    }
  }
}

export * from './types'
export * from './utils'
