export function getEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === null) {
    throw 'Missing env var for ' + name
  }
  return value
}

import axios from 'axios'

export type GA4Options = {
  clientId: string
}

export type GA4Event = {
  name: string
  params?: GA4Params
}

export type GA4Params = Record<string, string | number>

export type EventBodyParams = {
  clientId: string
  events: GA4Event[]
}

export default class BotonicPluginGoogleAnalytics4 {
  private baseUrl = 'https://www.google-analytics.com/mp/collect'
  private apiSecret: string
  private measurementId: string
  private clientId: string
  private userId?: string
  constructor(options: GA4Options) {
    this.apiSecret = getEnv('ga4ApiSecret')
    this.measurementId = getEnv('ga4MeasurementId')
    this.clientId = options.clientId
  }

  public async track(events: GA4Event | GA4Event[]): Promise<void> {
    events = Array.isArray(events) ? events : [events]

    await axios.post(
      this.baseUrl,
      {
        client_id: this.clientId,
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
