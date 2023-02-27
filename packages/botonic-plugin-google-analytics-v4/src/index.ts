import { PluginPostRequest, PluginPreRequest } from '@botonic/core'
import axios from 'axios'

import { BotSession, GA4Event, GA4Options } from './types'

const defaultGetClientId = (session: BotSession) => session.user.id

export default class BotonicPluginGoogleAnalytics4 {
  private baseUrl = 'https://www.google-analytics.com/mp/collect'
  private apiSecret: string
  private measurementId: string
  private getClientId: (session: BotSession) => string
  private userId?: string
  constructor(options: GA4Options) {
    this.apiSecret = getEnv('ga4ApiSecret')
    this.measurementId = getEnv('ga4MeasurementId')
    this.getClientId = options.getClientId || defaultGetClientId
  }

  pre(_request: PluginPreRequest): void {}
  post(_request: PluginPostRequest): void {}

  public async track(
    session: BotSession,
    events: GA4Event | GA4Event[]
  ): Promise<void> {
    events = Array.isArray(events) ? events : [events]

    await axios.post(
      this.baseUrl,
      {
        client_id: this.getClientId(session),
        user_id: this.userId,
        events,
      },
      {
        params: {
          measurement_id: this.measurementId,
          api_secret: this.apiSecret,
        },
      }
    )
  }
}

export function getEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === null) {
    throw 'Missing env var for ' + name
  }
  return value
}
