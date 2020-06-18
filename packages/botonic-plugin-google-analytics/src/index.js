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

  /**
   * Track event to Google Analytics
   * @param {Object} eventFields - Event fields to send (see https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields)
   * @param {string} eventFields.category - Google Analytics eventCategory field
   * @param {string} eventFields.action - Google Analytics eventAction field
   * @param {string} [eventFields.label] - Google Analytics eventLabel field
   * @param {number} [eventFields.value] - Google Analytics eventValue field
   * @param  {Function} [callback]  - Callback to fire after tracking completes
   * @returns {Promise<void>}
   */
  track(eventFields, callback) {
    if (!eventFields.action || !eventFields.category)
      throw 'The eventFields object must contain the fields: action and category'

    this.analytics.track(eventFields.action, eventFields)
      .then(callback)
      .catch(error => {
        throw `Error while tracking to Google Analytics: ${error}`
      })
  }
}
