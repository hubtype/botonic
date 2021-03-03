import Analytics from 'analytics-node'

import { ANALYTICS_WRITE_KEY, TRACKING_EVENTS } from '../constants'
import { AnalyticsService } from '../interfaces'
import { getSystemInformation } from '../util/processes'
import { GlobalCredentialsHandler } from './credentials-handler'

export class Telemetry {
  analyticsService: AnalyticsService
  globalCredentialsHandler: GlobalCredentialsHandler
  isAnalyticsEnabled = process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
  events = TRACKING_EVENTS

  constructor() {
    this.analyticsService = new Analytics(ANALYTICS_WRITE_KEY, { flushAt: 1 })
    this.globalCredentialsHandler = new GlobalCredentialsHandler()
  }

  createAnonymousIdIfNotExists(): void {
    if (!this.globalCredentialsHandler.hasAnonymousId()) {
      this.globalCredentialsHandler.refreshAnonymousId()
    }
  }

  track(event: string, properties = {}): void {
    if (this.isAnalyticsEnabled) {
      this.createAnonymousIdIfNotExists()
      const {
        analytics: { anonymous_id },
      } = this.globalCredentialsHandler.read()
      properties = {
        ...getSystemInformation(),
        ...properties,
      }
      this.analyticsService.track({
        event: event,
        anonymousId: anonymous_id,
        properties: properties,
      })
    }
  }

  trackLoggedIn(properties = {}): void {
    this.track(this.events.LOGGED_IN, properties)
  }

  trackLoggedOut(properties = {}): void {
    this.track(this.events.LOGGED_OUT, properties)
  }

  trackCreated(properties = {}): void {
    this.track(this.events.CREATED_BOT, properties)
  }

  trackServed(properties = {}): void {
    this.track(this.events.SERVED_BOT, properties)
  }

  trackTested(properties = {}): void {
    this.track(this.events.TESTED_BOT, properties)
  }

  trackTrained(properties = {}): void {
    this.track(this.events.TRAINED_BOT, properties)
  }

  trackInstalledBotonic(properties = {}): void {
    this.track(this.events.INSTALLED_BOTONIC, properties)
  }

  trackDeployed(properties = {}): void {
    this.track(this.events.DEPLOYED_BOT, properties)
  }

  trackError(type: string, properties = {}): void {
    this.track(this.events.ERROR_BOTONIC_CLI, {
      ...properties,
      error_type: type,
    })
  }
}
