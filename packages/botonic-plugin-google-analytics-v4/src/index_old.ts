// @ts-nocheck
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default class BotonicPluginGoogleAnalytics {
  GA_URL = 'https://www.google-analytics.com/collect'
  GA_API_VERSION = '1'

  /**
   * @param {Object} options - Options for the plugin
   * @param {string} options.trackingId - Tracking ID for Google Analytics.
   * @param {function({session: object}): string} [options.getClientId] - Method that returns the Google Analytics Client Id from browser.
   * @param {function({session: object}): string} [options.getUserId] - Method that returns a unique user ID as string.
   * @param {boolean} [options.automaticTracking] - If set to false, no automatic tracking will be done in post method.
   * @param {function({session: object, input: object, lastRoutePath: string}): object} [options.getEventFields] - Method
   *    that returns the eventFields to track as object (used only if automaticTracking is not set or set to true).
   */
  constructor(options) {
    this.trackingId = options.trackingId
    this.getGaClientId = options.getClientId
    this.getUserId = options.getUserId
    this.getEventFields = options.getEventFields ?? this.defaultGetEventFields
    this.automaticTracking = options.automaticTracking ?? true
  }

  async pre({ input, session, lastRoutePath }) {}

  async post({ input, session, lastRoutePath, response }) {
    if (this.automaticTracking) {
      await this.track({
        session,
        eventFields: this.getEventFields({ session, input, lastRoutePath }),
      })
    }
  }

  defaultGetEventFields = ({ session, input, lastRoutePath }) => ({
    category: session.bot.name,
    action: lastRoutePath,
    label: input.data,
  })

  /**
   * Track event to Google Analytics
   * @param {Object} session - Bot's session
   * @param {Object} eventFields - Event fields to send (see https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields)
   * @param {string} eventFields.category - Google Analytics eventCategory field
   * @param {string} eventFields.action - Google Analytics eventAction field
   * @param {string} [eventFields.label] - Google Analytics eventLabel field
   * @param {number} [eventFields.value] - Google Analytics eventValue field
   * @returns {Promise}
   */
  async track({ session, eventFields }) {
    if (!eventFields.category || !eventFields.action)
      throw new Error(
        'The eventFields object must contain the fields: category (ec) and action (ea)'
      )

    const params = {
      v: this.GA_API_VERSION,
      tid: this.trackingId,
      t: 'event',
      ec: eventFields.category,
      ea: eventFields.action,
      el: eventFields.label,
      ev: eventFields.value,
    }
    const cid = this.getGaClientId && this.getGaClientId({ session })
    params.cid = cid ?? uuidv4()

    const uid = this.getUserId && this.getUserId({ session })
    if (uid) params.uid = uid

    return await axios.get(this.GA_URL, { params })
  }
}
