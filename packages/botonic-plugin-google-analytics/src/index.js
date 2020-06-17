import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export default class BotonicPluginGoogleAnalytics {
  constructor({ botName, trackingId }) {
    this.analytics = Analytics({
      app: botName,
      plugins: [
        googleAnalytics({
          trackingId: trackingId,
        }),
      ],
    })
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {}

  async track(eventName, eventFields, callback) {
    await this.analytics.track(eventName, eventFields, callback)
  }
}
