import Analytics from 'analytics-node'

import { ANALYTICS_WRITE_KEY } from '../constants'
import { AnalyticsService } from '../interfaces'
import { getSystemInformation } from '../util/environment-info'
import { GlobalCredentialsHandler } from './credentials-handler'

const TRACKING_EVENTS = {
  // BEWARE: Changing these names will screw analytics
  // Despite the event is written in past tense, events are tracked at the very beginning of the action.
  INSTALL_BOTONIC: 'Installed Botonic CLI',
  LOGIN: 'Logged In Botonic CLI',
  LOGOUT: 'Logged Out Botonic CLI',
  CREATE_BOT: 'Created Botonic Bot CLI',
  SERVE_BOT: 'Served Botonic CLI',
  TEST_BOT: 'botonic test',
  TRAIN_BOT: 'Trained with Botonic train',
  DEPLOY_BOT: 'Deployed Botonic CLI',
  ERROR_BOTONIC_CLI: 'Error Botonic CLI',
  DEPLOY_BOT_1_0: 'Deployed Botonic 1.0',
  DESTROY_BOT_1_0: 'Destroyed Botonic 1.0',
}

export class Telemetry {
  analyticsService: AnalyticsService
  globalCredentialsHandler: GlobalCredentialsHandler | undefined
  isAnalyticsEnabled = process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
  events = TRACKING_EVENTS

  constructor() {
    this.analyticsService = new Analytics(ANALYTICS_WRITE_KEY, { flushAt: 1 })
    try {
      this.globalCredentialsHandler = new GlobalCredentialsHandler()
    } catch (e) {
      this.isAnalyticsEnabled = false
      this.globalCredentialsHandler = undefined
      console.error(e)
    }
  }

  createAnonymousIdIfNotExists(): string | undefined {
    if (!this.globalCredentialsHandler) return undefined
    if (!this.globalCredentialsHandler.hasAnonymousId()) {
      return this.globalCredentialsHandler.refreshAnonymousId()
    }
    const credentials = this.globalCredentialsHandler.load()
    return credentials?.analytics.anonymous_id
  }

  getTelemetryProperties(properties: any): any {
    return {
      ...getSystemInformation(),
      ...properties,
    }
  }

  track(event: string, properties = {}): void {
    if (this.globalCredentialsHandler && this.isAnalyticsEnabled) {
      const anonymousId = this.createAnonymousIdIfNotExists()
      if (!anonymousId) return
      this.analyticsService.track({
        event: event,
        anonymousId: anonymousId,
        properties: this.getTelemetryProperties(properties),
      })
    }
  }

  trackLogin(properties = {}): void {
    this.track(this.events.LOGIN, properties)
  }

  trackLogout(properties = {}): void {
    this.track(this.events.LOGOUT, properties)
  }

  trackCreate(properties = {}): void {
    this.track(this.events.CREATE_BOT, properties)
  }

  trackServe(properties = {}): void {
    this.track(this.events.SERVE_BOT, properties)
  }

  trackTest(properties = {}): void {
    this.track(this.events.TEST_BOT, properties)
  }

  trackTrain(properties = {}): void {
    this.track(this.events.TRAIN_BOT, properties)
  }

  trackInstallBotonic(properties = {}): void {
    this.track(this.events.INSTALL_BOTONIC, properties)
  }

  trackDeploy(properties = {}): void {
    this.track(this.events.DEPLOY_BOT, properties)
  }

  trackDeploy1_0(properties = {}): void {
    this.track(this.events.DEPLOY_BOT_1_0, properties)
  }

  trackDestroy1_0(properties = {}): void {
    this.track(this.events.DESTROY_BOT_1_0, properties)
  }

  trackError(type: string, properties = {}): void {
    this.track(this.events.ERROR_BOTONIC_CLI, {
      ...properties,
      error_type: type,
    })
  }
}
