import { Plugin, PluginPostRequest, Session } from '@botonic/core'
import axios from 'axios'

import { GA4Event, GA4Options } from './types'

const defaultGetClientId = (session: Session) => session.user.id

export default class BotonicPluginGoogleAnalytics4 implements Plugin {
  private baseUrl = 'https://www.google-analytics.com/mp/collect'
  private apiSecret: string
  private measurementId: string
  private getClientId: (session: Session) => string
  private getUserId?: () => string

  constructor(options: GA4Options) {
    this.apiSecret = options.apiSecret
    this.measurementId = options.measurementId
    this.getUserId = options.getUserId
    this.getClientId = options.getClientId || defaultGetClientId
  }

  post(_request: PluginPostRequest): void {
    return
  }

  public async track(
    session: Session,
    events: GA4Event | GA4Event[]
  ): Promise<void> {
    events = Array.isArray(events) ? events : [events]

    await axios.post(
      this.baseUrl,
      {
        client_id: this.getClientId(session),
        user_id: this.getUserId && this.getUserId(),
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
